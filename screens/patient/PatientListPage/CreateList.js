import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, Dimensions, Pressable, Platform, TextInput, Image, Modal } from 'react-native'
import { View } from '../../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker'
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from "expo-notifications";
import uuid from 'react-native-uuid';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from "firebase/firestore"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Colors, db, storage, auth } from '../../../config';
const {width, height} = Dimensions.get('window');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function CreateList({navigation}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [imageUrl, setImage] = useState('')
    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false)
    const [enable, setEnable] = useState(true)
    const [percentUp, setPercent] = useState(0)

    useEffect(() => {
        (async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    "การเข้าถึงรูปภาพ",
                    "Sorry, we need camera roll permissions to make pick the photo",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ])
            }

            const result = await Notifications.requestPermissionsAsync();
            if (result.status !== 'granted') {
                Alert.alert(
                    "การแจ้งเตือนกิจกรรม",
                    "เปิดการแจ้งเตือนเพื่อการแจ้งเตือนกิจกรรม",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ])
            }
        }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        });
        //console.log(result);
        if (!result.cancelled) {
        setImage(result.uri);
        }
    };

    const onChangeDateTime = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        console.log(currentDate);
        setShow(Platform.OS === 'ios')
        setDate(currentDate);
    };

    const uploadImageAsync = async (uri, path, callBack) => {
        if (uri) {
            console.log('image ok', uri);
            const imageRef = ref(storage, path);
            await fetch(uri)
            .then(response => response.blob())
            .then(blob => {
                const uploadTask = uploadBytesResumable(imageRef, blob);
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    setPercent(progress.toFixed(1))
                },
                (error) => {
                },  
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        //console.log('File available at', downloadURL);
                        callBack(downloadURL);
                    });
                })
            });
        } else {
            callBack('');
        }
    }

    const uploadItemList = () => {
        setEnable(false)
        if (!title || !description) {
            alert('กรุณาระบุรายละเอียด')
            setEnable(true)
            return
        }
        const id = uuid.v4()
        const listRef = doc(db, "users", auth.currentUser.uid , "List", id) // uniqe list for sub collection (collection group)
        const payload = {
            day: date,
            date_millisecconds: date.getTime(),
            day_string: (new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format(date)).toString(),
            title: title,
            description: description,
            id: id,
            imageUrl: '',
            isDone: false
        }
        setDoc(listRef, payload, {merge: true})
        notif(title, description, date.setSeconds(0,0)); // second 0 ms 0
        uploadImageAsync(imageUrl, 'list-image/'+ id, (result) => {
            if (result) {
                setDoc(listRef, {imageUrl: result}, {merge: true})
            }
            navigation.goBack()
        })
    }

    const notif = async (noti_title, text, time) => {
        // console.log(time);
        const trigger = new Date(time);
        trigger.setSeconds(0);
        // console.log(trigger);
        let lol = await Notifications.scheduleNotificationAsync({
            content: {
                title: "กิจกรรม: "+noti_title,
                body: text,
            },
            trigger,
        });
        // console.log(lol);
        return lol;
    };

    return (
        <View isSafe style={{backgroundColor: 'white', height: height}}>
            <KeyboardAwareScrollView enableOnAndroid={true}>
                <View style={styles.container}>
                    <Modal
                        transparent={true}
                        visible={percentUp > 0 && percentUp < 100 ? true : false}
                    >
                        <View style={{flex: 1 ,justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.modalView}>
                                <Text style={[styles.textStyle, {color: 'black'}]}>อัพโหลดแล้ว{percentUp}%</Text>
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.viewHeader}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                        </Pressable>
                        <Text style={styles.textHeader}>สร้างรายการใหม่</Text>
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
                    <Text style={styles.textStyle}>เพิ่มภาพ</Text>
                    {imageUrl ? 
                        <Image 
                            style={{
                                height: width*0.7, 
                                width: width*0.7, 
                                borderRadius: 5,
                                margin: 15
                            }}  
                            source={{uri: imageUrl}}
                        /> : 
                        null
                    }
                    <Pressable 
                        style={[styles.button, styles.buttonOpen]} 
                        onPress={pickImage}
                    >
                        <Text style={styles.textStyle}>เลือกภาพ</Text>
                    </Pressable>
                    {show &&
                        <View style={{width: '100%'}}>
                            <DateTimePicker
                                style={styles.picker} 
                                testID="datePicker"
                                value={date}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={onChangeDateTime}
                            />
                            <DateTimePicker
                                style={styles.picker} 
                                testID="datePicker"
                                value={date}
                                mode={'time'}
                                is24Hour={true}
                                display="default"
                                onChange={onChangeDateTime}
                            />
                        </View> 
                    }
                    <Pressable
                        disabled={!enable}
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setShow(true)}
                        >
                        <Text style={styles.textStyle}>เลือกวันที่และเวลา</Text>
                    </Pressable>
                    <Pressable
                        disabled={!enable}
                        style={[styles.button, styles.buttonSummit, {marginBottom: 100, opacity: enable ? 1 : 0.5}]}
                        onPress={uploadItemList}
                        >
                        <Text style={styles.textStyle}>ตกลง</Text>
                    </Pressable>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        backgroundColor: 'white',
        // justifyContent: 'center'
    }, 
    picker: {
        width: 90,
        marginHorizontal: (width - 90)/2,
        marginVertical: 5
    },
    button: {
        justifyContent: 'center',
        width: width*0.9,
        height: 50,
        borderRadius: 5,
        marginVertical: 10
    },
    buttonOpen: {
        backgroundColor: Colors.orange,
    },
    buttonSummit: {
        backgroundColor: '#1597e5',
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
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
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 50,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
})