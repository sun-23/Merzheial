import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, Dimensions, Pressable, Platform, TextInput, Image, ScrollView, KeyboardAvoidingView, SafeAreaView, Modal } from 'react-native'
import { View } from '../../components'
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Colors, db, storage } from '../../config';
import { userInfoAtom } from '../../store';
import { useRecoilValue } from 'recoil';
import uuid from 'react-native-uuid';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
const {width, height} = Dimensions.get('window');

export default function ChatScreen({navigation}) {

    const scrollViewRef = useRef();
    const userInfo = useRecoilValue(userInfoAtom)
    const [message, setMessage] = useState('')
    const [chat, setChat] = useState([])
    const [imageUrl, setImage] = useState('')

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
        }
        })();

        const colRef = collection(db, "Chat"+userInfo.uid)
        const q = query(colRef, orderBy("time_milisecconds", "asc"))
        const unsub = onSnapshot(q, (querySnapshot) => {
            setChat(querySnapshot.docs.map((doc) => doc.data()))
        });

        return () => {
            unsub()
        } 
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        });
        console.log(result);
        if (!result.cancelled) {
            let { width, height } = result;
            const manipResult = await manipulateAsync(
                result.uri,
                [{ resize: { width: 480, height: (height/width*480) } }],
                { format: SaveFormat.JPEG, compress: 1 }
            );
            console.log(manipResult);
            setImage(manipResult.uri);
        }
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

    const uploadImgMessage = () => {
        const id = uuid.v4()
        const time = new Date()
        uploadImageAsync(imageUrl, 'chat-image/'+ id, (url) => {
            console.log('upload ok');
            addDoc(colRef,{
                time_milisecconds: time.getTime(),
                time_string: (new Intl.DateTimeFormat("th-TH",{ dateStyle: 'medium', timeStyle: 'short' }).format(time.getTime())).toString(),
                image: url,
                sender_uid: userInfo.uid,
                sender_name: userInfo.firstname,
                sender_url: userInfo.urlImage,
                type: 'image'
            })
        })
    }

    const uploadMessage = () => {
        console.log('send');
        if (imageUrl) {
            uploadImgMessage();
            return;
        }
        const time = new Date()
        const colRef = collection(db, "Chat"+userInfo.uid) //chat is Chat+patient uid
        addDoc(colRef,{
            time_milisecconds: time.getTime(),
            time_string: (new Intl.DateTimeFormat("th-TH",{ dateStyle: 'medium', timeStyle: 'short' }).format(time.getTime())).toString(),
            message: message,
            sender_uid: userInfo.uid,
            sender_name: userInfo.firstname,
            sender_url: userInfo.urlImage,
            type: 'text'
        })
        setMessage('');
    }
    
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.viewHeader}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                    </Pressable>
                    <Text style={styles.textHeader}>ห้อง chat กับหมอ</Text>
                </View>
                <View style={{flex: 1,backgroundColor: '#f3f3f3'}}>
                    <ScrollView 
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    >
                        {chat.map((item) => {
                            return (item.type === 'text') ? <MessageBox item={item} user_uid={userInfo.uid} key={item.time_milisecconds}/> : <MessageImageBox item={item} user_uid={userInfo.uid} key={item.time_milisecconds}/>
                        })}
                    </ScrollView>
                </View> 
                <View style={styles.viewBottom}>
                    <Pressable onPress={pickImage}>
                        <Ionicons name={'ios-image'} size={30} color={Colors.blue} />
                    </Pressable>
                    <TextInput
                        style={styles.titleInput} 
                        value={message} 
                        onChangeText={setMessage}
                        placeholder='พิมข้อความ'
                        multiline={true}
                    />
                    <Pressable onPress={uploadMessage}>
                        <Ionicons name={'ios-send'} size={30} color={Colors.blue} />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
            {imageUrl ? <View style={{width: width, height: 'auto', paddingBottom: 10, alignItems: 'center'}}>
                <Text style={{paddingBottom: 10}}>ภาพที่เลือกจะส่ง</Text>
                <View style={{flexDirection: 'row', width: width, justifyContent: 'space-evenly'}}>
                    <Pressable onPress={() => setImage('')}>
                        <Ionicons name={'close'} size={30} color={Colors.red} />
                    </Pressable>
                    <Image style={{width: 100, height: 100, paddingLeft: 10, borderRadius: 5}} source={{uri: imageUrl}}></Image>
                </View>
            </View> : null}
        </SafeAreaView>
    )
}

const MessageImageBox = ({item, user_uid}) => {
    return  (
        <View>
            <View 
                key={item.time_milisecconds}
                style={{
                    width: width,
                    height: 'auto',
                    paddingHorizontal: 15,
                    flexDirection: (item.sender_uid === user_uid) ? 'row-reverse' : 'row',
                    alignItems: 'center'
                }}
            >
                {!item.sender_url ? 
                <Image 
                    style={{
                        height: 40, 
                        width: 40, 
                        borderRadius: 40,
                        margin: 12,
                        alignSelf: 'flex-start'
                    }}  
                    source={require('../../assets/avatar.webp')}
                /> : 
                <Image 
                    style={{
                        height: 40, 
                        width: 40, 
                        borderRadius: 40,
                        margin: 12,
                        alignSelf: 'flex-start'
                    }} 
                    source={{uri: item.sender_url}}
                />}
                <Text style={{
                    alignSelf: 'center', 
                    fontSize: 16
                }}>{item.sender_name}</Text>
            </View>
            <Image 
                style={{
                    height: 150, 
                    width: 150, 
                    borderRadius: 5,
                    margin: 12,
                    alignSelf: (item.sender_uid === user_uid) ? 'flex-end' : 'flex-start'
                }} 
                source={{uri: item.sender_url}}
            />
            <Text style={{
                alignSelf: (item.sender_uid === user_uid) ? 'flex-end' : 'flex-start' ,
                fontSize: 10, 
                fontWeight: '300', 
                marginHorizontal: 15,
                fontSize: 16
            }}>{item.time_string}</Text>
        </View>
    )
}

const MessageBox = ({item, user_uid}) => {
    return  (
        <View>
            <View 
                key={item.time_milisecconds}
                style={{
                    width: width,
                    height: 'auto',
                    paddingHorizontal: 15,
                    flexDirection: (item.sender_uid === user_uid) ? 'row-reverse' : 'row',
                    alignItems: 'center'
                }}
            >
                {!item.sender_url ? 
                <Image 
                    style={{
                        height: 40, 
                        width: 40, 
                        borderRadius: 40,
                        margin: 12,
                        alignSelf: 'flex-start'
                    }}  
                    source={require('../../assets/avatar.webp')}
                /> : 
                <Image 
                    style={{
                        height: 40, 
                        width: 40, 
                        borderRadius: 40,
                        margin: 12,
                        alignSelf: 'flex-start'
                    }}
                    source={{uri: item.sender_url}}
                />}
                <Text style={{
                    alignSelf: 'center',
                    fontSize: 16 
                }}>{item.sender_name}</Text>
            </View>
            <View style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: width * 0.7,
                    backgroundColor: (item.sender_uid === user_uid) ? '#548CFF' : 'white',
                    borderRadius: 10,
                    paddingHorizontal: 5,
                    marginHorizontal: 15,
                    alignSelf: (item.sender_uid === user_uid) ? 'flex-end' : 'flex-start'
                }}>
                <Text style={{
                    fontSize: 20, 
                    fontWeight: '300', 
                    padding: 5,
                    color: (item.sender_uid === user_uid) ? 'white' : 'black'
                }}>{item.message}</Text>
            </View>
            <Text style={{
                alignSelf: (item.sender_uid === user_uid) ? 'flex-end' : 'flex-start' ,
                fontSize: 10, 
                fontWeight: '300', 
                marginHorizontal: 15,
                fontSize: 16
            }}>{item.time_string}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        alignItems: 'center',
        alignSelf: 'center',
    },
    viewBottom: {
        width: width,
        height: 'auto',
        paddingVertical: 10,
        flexDirection: 'row', 
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    titleInput:{
        height: 'auto',
        minHeight: 35,
        maxHeight: 80,
        width: width* 0.7,
        marginHorizontal: 12,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 20,
        backgroundColor: "#f7f7f7",
    },
})