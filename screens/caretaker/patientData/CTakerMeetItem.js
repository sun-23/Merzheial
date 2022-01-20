import React from 'react'
import { StyleSheet, Text, Dimensions, ScrollView, Pressable } from 'react-native'
import { View } from '../../../components'
import { Colors } from '../../../config';
const {width, height} = Dimensions.get('window');

import { Ionicons } from '@expo/vector-icons';

const CTakerMeetItem = ({navigation, route}) => {

    const { data } = route.params

    return (
        <ScrollView>
            <View isSafe style={styles.container}>
                <View style={styles.viewHeader}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                    </Pressable>
                    <Text style={styles.textHeader}>{data.title}</Text>
                </View>  
                <View style={styles.content}>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>{(new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(data.time.seconds * 1000)))).toString()}</Text>
                    <Text style={styles.textStyle}>รายละเอียด: {data.description}</Text>
                    <Text style={[styles.textStyle, {color : (data.note.length > 0) ? "black" : "red"}]}>note ของแพทย์: {(data.note.length > 0) ? data.note : "รอแพทย์ประเมิณหลังนัดพบ"}</Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default CTakerMeetItem

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
})

