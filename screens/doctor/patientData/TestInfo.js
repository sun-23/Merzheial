import React from 'react'
import { StyleSheet, Text, Dimensions, ScrollView, Image, Pressable } from 'react-native'
import { View } from '../../../components'
import { Colors } from '../../../config';
import { Ionicons } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');

const answer_type = [
    "เหตุการณ์ไม่เคยเกิดขึ้นเลยหรือเกิดขึ้นนานๆ ครั้ง ใน 1 ปี",
    "เหตุการณ์เกิดขึ้น 1 หรือ 2 ครั้ง ในระยะเวลา 1 เดือน",
    "เหตุการณ์เกิดขึ้นเกือบทุกสัปดาห์",
    "เหตุการณ์เกิดขึ้นเกือบทุกวัน"
]

const TestInfo = ({navigation, route}) => {

    const { data } = route.params;

    const RenderTest = () => {
        if (data.type === "test-v2") {
            return (
                <ScrollView style={{marginBottom: 100}}>
                    {/* 1 */}
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 1 {data.choice1.title}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>เฉลย: {data.choice1.text1} {data.choice1.text2} {data.choice1.text3}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>คำตอบ: {data.choice1.anstext1} {data.choice1.anstext2} {data.choice1.anstext3}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 2 */}
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 2 {data.choice2.title}</Text>
                    <Image style={{width: width * 0.8, height: width * 0.8, borderRadius: 5, marginVertical: 5}} source={require("../../../assets/dog.webp")}/>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>เฉลย: {data.choice2.answer}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>คำตอบ: {data.choice2.user_answer}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 3 */}
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 3 {data.choice3.title}</Text>
                    <Image style={{width: width * 0.8, height: width * 0.8, borderRadius: 5, marginVertical: 5}} source={require("../../../assets/lion.jpeg")}/>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>เฉลย: {data.choice3.answer}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>คำตอบ: {data.choice3.user_answer}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 4 */}
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 4 {data.choice4.title}</Text>
                    <Image style={{width: width * 0.8, height: width * 0.8, borderRadius: 5, marginVertical: 5}} source={require("../../../assets/camel.jpg")}/>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>เฉลย: {data.choice4.answer}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>คำตอบ: {data.choice4.user_answer}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 5 */}
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 5 {data.choice5.title}</Text>
                    <Image style={{width: width * 0.8, height: width * 0.8, borderRadius: 5, marginVertical: 5}} source={{uri: data.choice5.url}}/>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 6 */}
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 6 {data.choice6.title}</Text>
                    <Image style={{width: width * 0.8, height: width * 0.8, borderRadius: 5, marginVertical: 5}} source={{uri: data.choice6.url}}/>
                </ScrollView>
            )
        } else if (data.type === "simple") {
            return <ScrollView style={{marginBottom: 200}}>
                {data.choice.map((item) => {
                    if (item.isTest) {
                        return <View key={item.id} style={{height: 'auto', width: 'auto', paddingVertical: 20}}>
                            <Text style={[styles.textStyle, {fontWeight: "bold"}]}>ข้อ{item.id} {item.title}</Text>
                            <Text style={[styles.textStyle, {fontWeight: "normal"}]}>คำตอบ: เลือกข้อ{item.choose_num} {answer_type[item.choose_num-1]}</Text>
                        </View>
                    }
                })}
            </ScrollView>
        } else {
            return <></>
        }
    }
    
    return (
        <View isSafe style={styles.container}>
            <View style={styles.viewHeader}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                </Pressable>
                <Text style={styles.textHeader}>ผลแบบทดสอบ</Text>
            </View>
            <View style={styles.content}>
                <Text style={[styles.textStyle, {fontWeight: '300'}]}>{(new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(data.user_time.seconds * 1000)))).toString()}</Text>
                {data.type === 'simple' ? <Text style={[styles.textStyle, {fontWeight: "bold", paddingBottom: 10}]}>ผล: {data.description}</Text> : null}
                <View style={{height: 4, width: width, backgroundColor: '#f0f0f0'}}></View>
                <RenderTest/>
            </View>
        </View>
    )
}

export default TestInfo

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