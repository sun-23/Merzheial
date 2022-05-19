import React, { useState } from 'react'
import { StyleSheet, Text, Image, Dimensions, ScrollView, Pressable, Modal } from 'react-native'
import { View, Button } from '../../../components'
import { Colors, db, auth } from '../../../config';
import { setDoc, doc } from '@firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');

const ItemList = ({navigation, route}) => {

    const [urlpreview, setUrlPreview] = useState();

    const onDone = () => {
        const { id } = route.params.data
        const listRef = doc(db, "users", auth.currentUser.uid , "List", id)
        setDoc(listRef, {isDone: true}, {merge: true})
        navigation.goBack()
    }

    return (
        <ScrollView>
            <View isSafe style={styles.container}>
                <View style={styles.viewHeader}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                    </Pressable>
                    <Text style={styles.textHeader}>{route.params.data.title}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>{route.params.data.day_string}</Text>
                    <Text style={styles.textStyle}>description: {route.params.data.description}</Text>
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
                    {route.params.data.imageUrl != "" ?
                        <Pressable 
                            onPress={() => setUrlPreview(route.params.data.imageUrl)}>
                            <Image 
                                style={{
                                    height: width*0.7, 
                                    width: width*0.7, 
                                    borderRadius: 5,
                                    marginVertical: 12,
                                    alignSelf: 'flex-start'
                                }}  
                                source={{uri: route.params.data.imageUrl}}
                            />
                        </Pressable>  : 
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
                            <Text style={[styles.textStyle, {alignSelf: 'center', color: 'white'}]}>No Image</Text>
                        </View>
                    }
                    {route.params.data.isDone === false ?
                        <Button 
                            style={[styles.button, styles.buttonOpen]} 
                            onPress={onDone}
                        >
                            <Text style={[styles.textStyle, {alignSelf: 'center', color: 'white'}]}>done</Text>
                        </Button> :
                        <Text style={styles.textHeader}>done</Text>
                    }
                </View>
            </View>
        </ScrollView>
    )
}

export default ItemList

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
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "left",
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
})
