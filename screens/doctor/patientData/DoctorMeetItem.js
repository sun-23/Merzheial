import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Dimensions, ScrollView, Modal, TextInput, Pressable, Alert, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, Button } from '../../../components'
import { Colors, db, storage } from '../../../config';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import uuid from 'react-native-uuid';
const {width, height} = Dimensions.get('window');

const DoctorMeetItem = ({navigation, route}) => {

    const { data } = route.params

    const [note, setNote] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [enable, setEnable] = useState(true);
    const [imageUrl, setImage] = useState('');
    const [urlpreview, setUrlPreview] = useState();

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        "Sorry, we need camera roll permissions to make pick the photo",
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
        console.log(result);
        if (!result.cancelled) {
            let { width, height } = result;
            const manipResult = await manipulateAsync(
                result.uri,
                [{ resize: { width: 480, height: (height/width*480) } }],
                { format: SaveFormat.JPEG, compress: 1 }
            );
            // console.log(manipResult);
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

    const updateNote = async () => {
        if (note.length === 0) {
            Alert.alert("specify a message","specify a message in the blank")
            return
        }
        setEnable(false)
        await setDoc(doc(db, "meet_doctor", data.id), {note: note}, {merge: true})
        setNote('');
        setModalVisible(false);
        setEnable(true)
        const id = uuid.v4()
        uploadImageAsync(imageUrl, 'note-image/'+ id, (result) => {
            if (result) {
                setDoc(doc(db, "meet_doctor", data.id), {noteUrl: result}, {merge: true})
            }
            navigation.goBack()
        })
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
                            title='update note'
                            borderless
                            onPress={() => setModalVisible(true)}
                            // ทำ screen list all test
                            // ทำ test info
                        />
                    </View>
                </View>
                {/* preview image */}
                <Modal 
                    visible={(urlpreview) ? true : false}
                    animationType="slide"
                >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable onPress={() => setUrlPreview('')}>
                            <Ionicons name={'close'} size={30} color={Colors.blue} />
                        </Pressable>
                        <Image style={{width: width*0.8, height: height*0.8, resizeMode: 'contain'}} source={{uri: urlpreview}}/>
                    </View>
                </Modal>

                {/* creat note */}
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
                            <Text style={styles.textHeader}>change note</Text>
                        </View>
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
                            <Text style={[styles.textStyle, {color: 'white', alignSelf: 'center'}]}>choose image</Text>
                        </Pressable>
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
                            <Text style={[styles.textStyle, {color: 'white', alignSelf: 'center'}]}>submit</Text>
                        </Pressable>
                    </View>
                    </KeyboardAwareScrollView>
                </Modal>
                <View style={styles.content}>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>{(new Intl.DateTimeFormat("en-US",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(data.time.seconds * 1000)))).toString()}</Text>
                    <Text style={styles.textStyle}>description: {data.description}</Text>
                    <Text style={[styles.textStyle, {color : (data.note.length > 0) ? "black" : "red"}]}>doctor's note: {(data.note.length > 0) ? data.note : "not yet evaluated"}</Text>
                    {route.params.data.noteUrl != "" ? 
                        <Pressable 
                                onPress={() => setUrlPreview(route.params.data.noteUrl)}>
                            <Image 
                                style={{
                                    height: width*0.7, 
                                    width: width*0.7, 
                                    borderRadius: 5,
                                    marginVertical: 12,
                                    alignSelf: 'flex-start'
                                }}  
                                source={{uri: route.params.data.noteUrl}}
                            />
                        </Pressable> : 
                        <View 
                            style={{
                                height: width*0.7, 
                                width: width*0.7, 
                                borderRadius: 5,
                                marginVertical: 12,
                                alignSelf: 'flex-start',
                                backgroundColor: '#a0a0a0',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        > 
                            <Text style={[styles.textStyle, {alignSelf: 'center', color: 'white'}]}>No Image note</Text>
                        </View>
                    }
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

