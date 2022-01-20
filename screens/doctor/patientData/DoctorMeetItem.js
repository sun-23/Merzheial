import React, {useState} from 'react'
import { StyleSheet, Text, Dimensions, ScrollView, Modal, TextInput, Pressable, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, Button } from '../../../components'
import { Colors, db } from '../../../config';
import { doc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');

const DoctorMeetItem = ({navigation, route}) => {

    const { data } = route.params

    const [note, setNote] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [enable, setEnable] = useState(true)

    const updateNote = async () => {
        if (note.length === 0) {
            Alert.alert("ระบุข้อความ","ระบุข้อความในช่องว่าง")
            return
        }
        setEnable(false)
        await setDoc(doc(db, "meet_doctor", data.id), {note: note}, {merge: true})
        setNote('');
        setModalVisible(false);
        setEnable(true)
        navigation.goBack()
    }

    return (
        <ScrollView>
            <View isSafe style={styles.container}>
                <View style={styles.viewHeader}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                    </Pressable>
                    <Text style={styles.textHeader}>{data.title}</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Button
                            style={{paddingRight: 5}} 
                            title='อัพเดต note'
                            borderless
                            onPress={() => setModalVisible(true)}
                            // ทำ screen list all test
                            // ทำ test info
                        />
                    </View>
                </View>
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
                                    setNote('');
                                }}
                            >
                                <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                            </Pressable>
                            <Text style={styles.textHeader}>เปลี่ยนแปลงอาการ</Text>
                        </View>
                        <TextInput 
                            placeholder='note'
                            multiline={true}
                            style={styles.multiInput}
                            value={note}
                            onChangeText={setNote}
                        />
                        <Pressable
                            style={[styles.button, styles.buttonSummit, {opacity: enable ? 1 : 0.5}]}
                            onPress={updateNote}
                            >
                            <Text style={[styles.textStyle, {color: 'white', alignSelf: 'center'}]}>ตกลง</Text>
                        </Pressable>
                    </View>
                    </KeyboardAwareScrollView>
                </Modal>
                <View style={styles.content}>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>{(new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(data.time.seconds * 1000)))).toString()}</Text>
                    <Text style={styles.textStyle}>รายละเอียด: {data.description}</Text>
                    <Text style={[styles.textStyle, {color : (data.note.length > 0) ? "black" : "red"}]}>note ของแพทย์: {(data.note.length > 0) ? data.note : "ยังไม่ได้ประเมิณ"}</Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default DoctorMeetItem

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        backgroundColor: 'white',
        minHeight: height
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
        alignSelf: 'flex-start'
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
})

