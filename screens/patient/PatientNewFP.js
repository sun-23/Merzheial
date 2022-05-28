import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, Dimensions, Pressable, Platform, TextInput, Image, Modal } from 'react-native'
import { View } from '../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from "firebase/firestore"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Colors, db, storage, auth } from '../../config';
const {width, height} = Dimensions.get('window');

export default function PatientNewFP({navigation}) {
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [relations, setRelations] = useState('')
    const [phone, setPhone] = useState('')
    const [imageUrl, setImage] = useState('')
    const [enable, setEnable] = useState(true)
    const [percentUp, setPercent] = useState(0)

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
                [{ resize: { width: 256, height: (height/width*256) } }],
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
        if (!name || !lastname) {
            alert('Please specify details')
            setEnable(true)
            return
        }
        const id = uuid.v4()
        const refRef = doc(db, "users", auth.currentUser.uid , "RelationshipLists", id)
        const payload = {
            name: name,
            lastname: lastname,
            relations: relations,
            id: id,
            avatarURL: '',
            phone: phone
        }
        setDoc(refRef, payload, {merge: true})
        uploadImageAsync(imageUrl, 'family-image/'+ id, (result) => {
            if (result) {
                setDoc(refRef, {imageUrl: result}, {merge: true})
            }
            navigation.goBack()
        })
    }

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
                                <Text style={[styles.textStyle, {color: 'black'}]}>uploaded{percentUp}%</Text>
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.viewHeader}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                        </Pressable>
                        <Text style={styles.textHeader}>add acquaintance</Text>
                    </View>
                    <TextInput 
                        placeholder='first name'
                        style={styles.titleInput}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput 
                        placeholder='last name'
                        multiline={true}
                        style={styles.titleInput}
                        value={lastname}
                        onChangeText={setLastname}
                    />
                    <TextInput 
                        placeholder='relationship'
                        multiline={true}
                        style={styles.titleInput}
                        value={relations}
                        onChangeText={setRelations}
                    />
                    <TextInput 
                        placeholder='phone number'
                        multiline={true}
                        style={styles.titleInput}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType='number-pad'
                    />
                    <Text style={styles.textStyle}>Add Image</Text>
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
                        <Text style={styles.textStyle}>Choose Image</Text>
                    </Pressable>
                    <Pressable
                        disabled={!enable}
                        style={[styles.button, styles.buttonSummit, {marginBottom: 100, opacity: enable ? 1 : 0.5}]}
                        onPress={uploadItemList}
                        >
                        <Text style={styles.textStyle}>submit</Text>
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