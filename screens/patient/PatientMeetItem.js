import React, {useState} from 'react'
import { StyleSheet, Text, Dimensions, ScrollView, Pressable, Modal, Image } from 'react-native'
import { View } from '../../components'
import { Colors } from '../../config';
import { Ionicons } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');

const PatientMeetItem = ({navigation, route}) => {

    const { data } = route.params;
    const [urlpreview, setUrlPreview] = useState();
    
    return (
        <ScrollView>
            <View isSafe style={styles.container}>
                <View style={styles.viewHeader}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                    </Pressable>
                    <Text style={styles.textHeader}>{data.title}</Text>
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
                {/* content */}
                <View style={styles.content}>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>{(new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(data.time.seconds * 1000)))).toString()}</Text>
                    <Text style={styles.textStyle}>doctor: {data.doctor_name}</Text>
                    <Text style={styles.textStyle}>description: {data.description}</Text>
                    <Text style={[styles.textStyle, {color : (data.note.length > 0) ? "black" : "red"}]}>doctor's note: {(data.note.length > 0) ? data.note : "Wait for the doctor to evaluate after the appointment."}</Text>
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

export default PatientMeetItem

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

