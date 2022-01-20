import React from 'react'
import { StyleSheet, Text, Image, Dimensions, ScrollView, Pressable } from 'react-native'
import { View } from '../../../components'
import { Colors } from '../../../config';
import { Ionicons } from '@expo/vector-icons';

const {width, height} = Dimensions.get('window');

const CTakerItemList = ({navigation, route}) => {

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
                    <Text style={styles.textStyle}>รายละเอียด: {route.params.data.description}</Text>
                    {route.params.data.imageUrl != "" ? 
                        <Image 
                            style={{
                                height: width*0.7, 
                                width: width*0.7, 
                                borderRadius: 5,
                                marginVertical: 12,
                                alignSelf: 'flex-start'
                            }}  
                            source={{uri: route.params.data.imageUrl}}
                        /> : 
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
                            <Text style={[styles.textStyle, {alignSelf: 'center', color: 'white'}]}>ไม่มีภาพ</Text>
                        </View>
                    }
                    {route.params.data.isDone === false ?
                        <Text style={styles.textHeader}>ผู้ป่วยยังไม่ได้ทำ</Text> :
                        <Text style={styles.textHeader}>ผู้ป่วยทำเสร็จแล้ว</Text>
                    }
                </View>
            </View>
        </ScrollView>
    )
}

export default CTakerItemList

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