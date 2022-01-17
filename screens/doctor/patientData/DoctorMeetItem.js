import React from 'react'
import { StyleSheet, Text, Dimensions, ScrollView } from 'react-native'
import { View, Button } from '../../../components'
import { Colors } from '../../../config';
const {width, height} = Dimensions.get('window');

const DoctorMeetItem = ({navigation, route}) => {
    return (
        <ScrollView>
            <View isSafe style={styles.container}>
                <View style={styles.viewHeader}>
                    <Button 
                        title='กลับ'
                        borderless
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={styles.textHeader}>{route.params.data.title}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>{(new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(route.params.data.time.seconds * 1000)))).toString()}</Text>
                    <Text style={styles.textStyle}>รายละเอียด: {route.params.data.description}</Text>
                    {/* todo add doctor note after meet */}
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

