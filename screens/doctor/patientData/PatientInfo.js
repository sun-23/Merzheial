import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, Dimensions, ScrollView, Modal, TextInput, Pressable, Alert } from 'react-native'
import { View, Button } from '../../../components'
import { Colors, db } from '../../../config';
import DateTimePicker from '@react-native-community/datetimepicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { collection, addDoc, query, where, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { useRecoilValue, useRecoilState } from 'recoil';
import { sortcurrentPatientMeetDocs, currentPatientMeetDocs } from '../../../store';

const {width, height} = Dimensions.get('window');

const PatientInfo = ({navigation, route}) => {
    const { patientInfo, doctorInfo } = route.params; 

    const [e,setCurrentPatientMeet] = useRecoilState(currentPatientMeetDocs);
    const currentPatientMeet = useRecoilValue(sortcurrentPatientMeetDocs);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalAl, setModalAl] = useState(false);
    const [description_al_lv, setDescription_al_lv] = useState('');
    const [enable, setEnable] = useState(true);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // effect
        const collectionMeetRef = collection(db, "meet_doctor");
        const q = query(collectionMeetRef, where("uid_patient", "==", patientInfo.uid), where("uid_doctor", "==", doctorInfo.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setCurrentPatientMeet(querySnapshot.docs.map((doc) => /**/({id: doc.id, ...doc.data()})/**/));
        });
        return () => {
            // cleanup
            unsubscribe()
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
            Alert.alert("ระบุข้อความ","ระบุข้อความในช่องว่าง")
            return
        }
        const docRef = collection(db, 'meet_doctor')
        setEnable(false)
        await addDoc(docRef, {
            description: description,
            doctor_name: doctorInfo.firstname + " " + doctorInfo.lastname,
            time: time,
            uid_doctor: doctorInfo.uid,
            uid_patient: patientInfo.uid,
            title: title
        })
        setDescription('');
        setTitle('');
        setShow(false);
        setModalVisible(false)
        setEnable(true)
    }

    const update_lv = async () => {
        if (description_al_lv === "") {
            Alert.alert("ระบุข้อความ","ระบุข้อความในช่องว่าง")
            return
        }
        const docRef = doc(db, 'users', patientInfo.uid)
        setEnable(false)
        await setDoc(docRef, {
            alzheimer_lv: description_al_lv
        }, {merge: true})
        setDescription_al_lv('');
        setModalAl(false)
        setEnable(true)
    }

    return (
        <View isSafe style={styles.container}>
            <View style={styles.viewHeader}>
                <Button 
                    title='กลับ'
                    borderless
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.textHeader}>คนไข้</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <Button
                        style={{paddingRight: 5}} 
                        title='ผลแบบทดสอบ'
                        borderless
                        onPress={() => navigation.navigate("Tests", { patientInfo: patientInfo })}
                        // ทำ screen list all test
                        // ทำ test info
                    />
                    <Button 
                        style={{paddingHorizontal: 5}} 
                        title='อัพเดตระยะอาการ'
                        borderless
                        onPress={() => setModalAl(true)}
                    />
                    <Button 
                        style={{paddingHorizontal: 5}} 
                        title='สร้างนัด'
                        borderless
                        onPress={() => setModalVisible(true)}
                    />
                </View>
            </View>
            {/* modal 1 */}
            <Modal
                animationType="slide"
                visible={modalAl}
            >
                <KeyboardAwareScrollView enableOnAndroid={true}>
                <View isSafe style={[styles.container, {height: height, width: width}]}>
                    <View style={styles.viewHeader}>
                        <Button 
                            title='กลับ'
                            borderless
                            onPress={() => setModalAl(false)}
                        />
                        <Text style={styles.textHeader}>เปลี่ยนแปลงอาการ</Text>
                    </View>
                    <TextInput 
                        placeholder='รายละเอียด'
                        multiline={true}
                        style={styles.multiInput}
                        value={description_al_lv}
                        onChangeText={setDescription_al_lv}
                    />
                    <Pressable
                        style={[styles.button, styles.buttonSummit, {marginBottom: 100, opacity: enable ? 1 : 0.5}]}
                        onPress={update_lv}
                        >
                        <Text style={[styles.textStyle, {color: 'white'}]}>ตกลง</Text>
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
                        <Button 
                            title='กลับ'
                            borderless
                            onPress={() => setModalVisible(false)}
                        />
                        <Text style={styles.textHeader}>สร้างนัด</Text>
                    </View>
                    <TextInput 
                        placeholder='หัวข้อ'
                        style={styles.titleInput}
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput 
                        placeholder='รายละเอียด'
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
                        <Text style={[styles.textStyle, {color: 'white'}]}>เลือกวันที่และเวลา</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonSummit, {marginBottom: 100, opacity: enable ? 1 : 0.5}]}
                        onPress={createMeet}
                        >
                        <Text style={[styles.textStyle, {color: 'white'}]}>ตกลง</Text>
                    </Pressable>
                </View>
                </KeyboardAwareScrollView>
            </Modal>
            <View style={styles.content}>
                <View style={[styles.item, styles.itemPatient]}>
                    {!patientInfo.urlImage ? 
                        <Image 
                            style={[styles.image, styles.imagePatient]}  
                            source={require('../../../assets/avatar.webp')}
                        /> : 
                        <Image 
                            style={[styles.image, styles.imagePatient]} 
                            source={{uri: patientInfo.urlImage}}
                    />}
                    <View style={styles.itemViewText}>
                        <Text style={styles.itemTitle}>ชื่อ: {patientInfo.firstname}</Text>
                        <Text style={styles.itemTitle}>นามสกุล: {patientInfo.lastname}</Text>
                        <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>สิ่งที่ชอบ {patientInfo.like}</Text>
                        <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>สิ่งที่ไม่ชอบ {patientInfo.unlike}</Text>
                        <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>สิ่งที่แพ้ {patientInfo.allergy}</Text>
                        <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>ที่อยู่ {patientInfo.address}</Text>
                        <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>uid: {patientInfo.uid}</Text>
                        <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3, color: (patientInfo.alzheimer_lv !== "") ? "black" : "red"}]}>ระยะอาการ: {patientInfo.alzheimer_lv !== "" ? patientInfo.alzheimer_lv : "ให้แพทย์ประเมิณ"}</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.textStyle}>รายการนัดหมาย</Text>
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
        width: width*0.9,
        margin: 12,
        padding: 10,
        borderRadius: 5,
        fontSize: 20,
        backgroundColor: "#f7f7f7",
    },
})