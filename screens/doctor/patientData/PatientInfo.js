import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, Dimensions, ScrollView, Modal, TextInput, Pressable, Alert } from 'react-native'
import { View, Button } from '../../../components'
import { Colors, db } from '../../../config';
import DateTimePicker from '@react-native-community/datetimepicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { collection, addDoc, query, where, onSnapshot, doc, setDoc, orderBy } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { currentPatientMeetDocs } from '../../../store';
import { Ionicons } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');

const PatientInfo = ({navigation, route}) => {
    const { patientInfo, doctorInfo } = route.params; 

    const [currentPatientMeet,setCurrentPatientMeet] = useRecoilState(currentPatientMeetDocs);
    const [patientFireInfo, setPatientFireInfo] = useState();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalAl, setModalAl] = useState(false);
    const [description_al_lv, setDescription_al_lv] = useState('');
    const [enable, setEnable] = useState(true);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [medicine, setMedicine] = useState('');
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // effect

        const docRef = doc(db, "users", patientInfo.uid);
        let last7day = new Date();
        last7day.setHours(0,0,0,0)
        last7day.setDate(last7day.getDate() - 7);

        const unsubscribeUserRef = onSnapshot(docRef, (doc) => {
            // console.log("ddddd",/**/({id: doc.id, ...doc.data()})/**/);
            setPatientFireInfo(/**/({id: doc.id, ...doc.data()})/**/);
        });

        // https://stackoverflow.com/questions/48698564/uncaught-in-promise-error-the-query-requires-an-index
        // Since you're querying on two fields (status and createDate), 
        // there needs to be a composite index on those two fields. 
        // Indices on individual fields are automatically created, 
        //but composite indexes are only created when you ask for them.

        const collectionMeetRef = collection(db, "meet_doctor");
        const q = query(
            collectionMeetRef,  
            where("uid_patient", "==", patientInfo.uid), 
            where("uid_doctor", "==", doctorInfo.uid),
            where("time_milisecconds", ">=", last7day.getTime()), 
            orderBy("time_milisecconds", "asc")
        )
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setCurrentPatientMeet(querySnapshot.docs.map((doc) => /**/({id: doc.id, ...doc.data()})/**/));
        });
        return () => {
            // cleanup
            unsubscribe()
            unsubscribeUserRef()
        }
    }, [])

    const onChangeDateTime = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        console.log(currentDate);
        setShow(Platform.OS === 'ios')
        setTime(currentDate);
    };

    const createMeet = async () => {
        if (title === "" || description === "") {
            Alert.alert("specify a message","specify a message in the blank")
            return
        }
        if (time.getTime() < new Date().valueOf()) {
            alert('Please enter a valid date.')
            return
        }
        const docRef = collection(db, 'meet_doctor')
        setEnable(false)
        await addDoc(docRef, {
            description: description,
            doctor_name: doctorInfo.firstname + " " + doctorInfo.lastname,
            patient_name: patientInfo.firstname + " " + patientInfo.lastname,
            time: time,
            time_milisecconds: time.getTime(),
            uid_doctor: doctorInfo.uid,
            uid_patient: patientInfo.uid,
            title: title,
            note: ""
        })
        setDescription('');
        setTitle('');
        setShow(false);
        setModalVisible(false)
        setEnable(true)
    }

    const update_lv = async () => {
        if (description_al_lv === "" || medicine === "") {
            Alert.alert("specify a message","specify a message in the blank")
            return
        }
        const docRef = doc(db, 'users', patientInfo.uid)
        setEnable(false)
        await setDoc(docRef, {
            alzheimer_lv: description_al_lv,
            medicine: medicine
        }, {merge: true})
        setDescription_al_lv('');
        setMedicine('');
        setModalAl(false)
        setEnable(true)
    }

    return (
        <View isSafe style={styles.container}>
            <View style={styles.viewHeader}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                </Pressable>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <Button
                        style={{paddingRight: 5}} 
                        title='test results'
                        borderless
                        onPress={() => navigation.navigate("Tests", { patientInfo: patientInfo })}
                        // ทำ screen list all test
                        // ทำ test info
                    />
                    <Button 
                        style={{paddingHorizontal: 5}} 
                        title='update patient information'
                        borderless
                        onPress={() => setModalAl(true)}
                    />
                    <Button 
                        style={{paddingHorizontal: 5}} 
                        title='make an appointment'
                        borderless
                        onPress={() => setModalVisible(true)}
                    />
                </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Button
                    style={{paddingRight: 5}} 
                    title='chat room with patient'
                    borderless
                    onPress={() => navigation.navigate("Chat", { patientInfo: patientInfo })}
                    // ทำ screen list all test
                    // ทำ test info
                />
                <Button
                    style={{paddingRight: 5}} 
                    title='activity'
                    borderless
                    onPress={() => navigation.navigate("List", { patientInfo: patientFireInfo })}
                />
                <Button
                    style={{paddingRight: 5}} 
                    title='Statistic'
                    borderless
                    onPress={() => navigation.navigate("Stat", { patientInfo: patientFireInfo })}
                />
            </View>

            {/* modal 1 */}
            <Modal
                animationType="slide"
                visible={modalAl}
            >
                <KeyboardAwareScrollView enableOnAndroid={true}>
                <View isSafe style={[styles.container, {height: height, width: width}]}>
                    <View style={styles.viewHeader}>
                        <Pressable 
                            onPress={() => {
                                setModalAl(false)
                                setDescription_al_lv('');
                                setMedicine('');
                            }}
                        >
                            <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                        </Pressable>
                        <Text style={styles.textHeader}>change the patient's stage of symptoms</Text>
                    </View>
                    <Text style={[styles.textStyle, {marginLeft: width*0.05}]}>change the patient's stage of symptoms</Text>
                    <TextInput 
                        placeholder='description'
                        multiline={true}
                        style={styles.multiInput}
                        value={description_al_lv}
                        onChangeText={setDescription_al_lv}
                    />
                    <Text style={[styles.textStyle, {marginLeft: width*0.05}]}>medication to take</Text>
                    <TextInput 
                        placeholder='description'
                        multiline={true}
                        style={styles.multiInput}
                        value={medicine}
                        onChangeText={setMedicine}
                    />
                    <Pressable
                        style={[styles.button, styles.buttonSummit, {marginBottom: 100, opacity: enable ? 1 : 0.5}]}
                        onPress={update_lv}
                        >
                        <Text style={[styles.textStyle, {color: 'white'}]}>submit</Text>
                    </Pressable>
                </View>
                </KeyboardAwareScrollView>
            </Modal>

            {/* modal 2 */}
            <Modal
                animationType="slide"
                visible={modalVisible}
            >
                <KeyboardAwareScrollView enableOnAndroid={true}>
                <View isSafe style={[styles.container, {height: height, width: width}]}>
                    <View style={styles.viewHeader}>
                        <Pressable 
                            onPress={() => {
                                setModalVisible(false)
                                setDescription('')
                                setTitle('')
                            }}
                        >
                            <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                        </Pressable> 
                        <Text style={styles.textHeader}>make an appointment</Text>
                    </View>
                    <Text style={[styles.textStyle, {marginLeft: width*0.05}]}>title</Text>
                    <TextInput 
                        placeholder='title'
                        style={styles.titleInput}
                        value={title}
                        onChangeText={setTitle}
                    />
                    <Text style={[styles.textStyle, {marginLeft: width*0.05}]}>description</Text>
                    <TextInput 
                        placeholder='description'
                        multiline={true}
                        style={styles.multiInput}
                        value={description}
                        onChangeText={setDescription}
                    />
                    {show &&
                        <View style={{width: '100%'}}>
                            <DateTimePicker
                                style={styles.picker} 
                                testID="datePicker"
                                value={time}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={onChangeDateTime}
                            />
                            <DateTimePicker
                                style={styles.picker} 
                                testID="datePicker"
                                value={time}
                                mode={'time'}
                                is24Hour={true}
                                display="default"
                                onChange={onChangeDateTime}
                            />
                        </View> 
                    }
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setShow(true)}
                        >
                        <Text style={[styles.textStyle, {color: 'white'}]}>select date and time</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonSummit, {marginBottom: 100, opacity: enable ? 1 : 0.5}]}
                        onPress={createMeet}
                        >
                        <Text style={[styles.textStyle, {color: 'white'}]}>submit</Text>
                    </Pressable>
                </View>
                </KeyboardAwareScrollView>
            </Modal>

            {/* content */}
            <View style={styles.content}>
                <Text style={[styles.textHeader, {alignSelf: 'flex-start'}]}>patients</Text>
                {patientFireInfo && <View style={[styles.item, styles.itemPatient, {maxHeight: height* 0.2}]}>
                    <View>
                        {!patientFireInfo.urlImage ? 
                            <Image 
                                style={[styles.image, styles.imagePatient]}  
                                source={require('../../../assets/avatar.webp')}
                            /> : 
                            <Image 
                                style={[styles.image, styles.imagePatient]} 
                                source={{uri: patientFireInfo.urlImage}}
                        />}
                        <View style={[styles.status, {backgroundColor: (patientFireInfo.alzheimer_stat_status !== 'none') ? ((patientFireInfo.alzheimer_stat_status === 'stage1') ? "#65C18C" : ((patientFireInfo.alzheimer_stat_status === 'stage2') ? "#F6D860" : '#FC4F4F')) :'#404040' }]}>
                            {/* alzheimer_stat_status: none, stage1, stage2, stage3 */}
                            <Text style={styles.status_text}>{patientFireInfo.alzheimer_stat_status}</Text>
                        </View>
                    </View>
                    <View style={styles.itemViewText}>
                        <ScrollView>
                            <Text style={styles.itemTitle}>first name: {patientFireInfo.firstname}</Text>
                            <Text style={styles.itemTitle}>last name: {patientFireInfo.lastname}</Text>
                            <Text style={styles.itemTitle}>age: {patientFireInfo.age}years sex: {patientFireInfo.sex_type === "female" ? "female" : "male"}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>like {patientFireInfo.like}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>not like {patientFireInfo.unlike}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>allergy {patientFireInfo.allergy}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>address {patientFireInfo.address}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>uid: {patientFireInfo.uid}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3, color: (patientFireInfo.alzheimer_lv !== "") ? "black" : "red"}]}>stage of symptoms: {patientFireInfo.alzheimer_lv !== "" ? patientFireInfo.alzheimer_lv : "Please have a doctor evaluate."}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3, color: (patientFireInfo.medicine !== "") ? "black" : "red"}]}>medication to take: {patientFireInfo.medicine !== "" ? patientFireInfo.medicine : "Please have a doctor evaluate."}</Text>
                        </ScrollView>
                    </View>
                </View>}
            </View>
            <Text style={styles.textStyle}>appointment list</Text>
            <ScrollView style={{height: 'auto', width: width}}>
                <View style={{height: 4, width: width, backgroundColor: '#f0f0f0'}}></View>
                {currentPatientMeet.map((data) => {
                return <Pressable 
                            key={data.id}
                            style={{
                                height: 'auto',
                                width: width,
                                paddingHorizontal: width * 0.05,
                                borderBottomWidth: 4,
                                borderColor: '#f0f0f0',
                                paddingBottom: 5,
                            }}
                            onPress={() => navigation.navigate("MeetInfo", { data: data })}
                        >
                            <Text style={styles.itemTitle}>{data.title}</Text>
                            {/* (new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(data.item.time.seconds * 1000)))).toString() */}
                            <Text style={styles.itemTime}>{(new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(data.time.seconds * 1000)))).toString()}</Text>
                        </Pressable>
                })}
            </ScrollView>
        </View>
    )
}

export default PatientInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        backgroundColor: 'white',
        height: height
        // justifyContent: 'center'
    }, 
    content: {
        width: width*0.8,
        alignItems: 'center'
    },
    button: {
        height: 50,
        width: width*0.9,
        margin: 12,
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonOpen: {
        backgroundColor: Colors.orange,
    },
    buttonSummit: {
        backgroundColor: '#1597e5',
    },
    textStyle: {
        fontWeight: "bold",
        fontSize: 20,
    },
    textHeader: {
        fontWeight: 'bold', 
        fontSize: 30,
        marginLeft: 20,
        marginBottom: 10
    },
    viewHeader: {
        width: width*0.9,
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center'
    },
    itemPatient:{
      width: width,
    },
    item:{
      height: 'auto',
      paddingHorizontal: width * 0.05,
      borderBottomWidth: 4,
      borderColor: '#f0f0f0',
      paddingBottom: 5,
      flexDirection: 'row',
    },
    imagePatient: {
      height: 70, 
      width: 70, 
    },
    image: { 
      borderRadius: 5,
      marginVertical: 12,
      alignSelf: 'flex-start'
    },
    itemTitle:{
      fontSize: 20,
      fontWeight: '600',
    },
    itemTime: {
        fontSize: 16,
        fontWeight: '400'
    },
    itemViewText: {
      alignSelf: 'center', 
      paddingLeft: 10
    },
    picker: {
        width: 90,
        marginHorizontal: (width - 90)/2,
        marginVertical: 5
    },
    titleInput:{
        height: 50,
        width: width*0.9,
        margin: 12,
        padding: 10,
        borderRadius: 5,
        fontSize: 20,
        backgroundColor: "#f7f7f7",
    },
    multiInput: {
        minHeight: 100,
        maxHeight: height*0.5,
        width: width*0.9,
        margin: 12,
        padding: 10,
        borderRadius: 5,
        fontSize: 20,
        backgroundColor: "#f7f7f7",
    },
    status: {
      width: 'auto',
      paddingHorizontal: 10,
      height: 40,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center'
    },
    status_text: {
      color: 'white', 
      fontSize: 20, 
      fontWeight: 'bold'
    },
})