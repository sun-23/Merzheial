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
                <ScrollView style={{marginBottom: 150}}>
                    {/* 1 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 1 {data.choice1.title}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>เฉลย: {data.choice1.text1} {data.choice1.text2} {data.choice1.text3} {data.choice1.text4} {data.choice1.text5}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>คำตอบ: {data.choice1.anstext1} {data.choice1.anstext2} {data.choice1.anstext3} {data.choice1.anstext4} {data.choice1.anstext5}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 2 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 2 {data.choice2.title}</Text>
                    <Image style={{width: width * 0.8, height: width * 0.8, borderRadius: 5, marginVertical: 5}} source={require("../../../assets/dog.webp")}/>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>เฉลย: {data.choice2.answer}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>คำตอบ: {data.choice2.user_answer}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 3 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 3 {data.choice3.title}</Text>
                    <Image style={{width: width * 0.8, height: width * 0.8, borderRadius: 5, marginVertical: 5}} source={require("../../../assets/lion.jpeg")}/>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>เฉลย: {data.choice3.answer}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>คำตอบ: {data.choice3.user_answer}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 4 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 4 {data.choice4.title}</Text>
                    <Image style={{width: width * 0.8, height: width * 0.8, borderRadius: 5, marginVertical: 5}} source={require("../../../assets/camel.jpg")}/>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>เฉลย: {data.choice4.answer}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>คำตอบ: {data.choice4.user_answer}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 5 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 5 {data.choice5.title}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้องรูปร่าง {data.choice6.contour ? 'ถูก' : 'ไม่ถูก'}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้องเข็มทิศ {data.choice6.hands ? 'ถูก' : 'ไม่ถูก'}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้องตำแหน่งตัวเลข {data.choice6.numbers_pos ? 'ถูก' : 'ไม่ถูก'}</Text>
                    <Image style={{width: width * 0.8, height: width * 0.8, borderRadius: 5, marginVertical: 5}} source={{uri: data.choice5.url}}/>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 6 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 6 {data.choice6.title}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice6.isSimilar ? 'เหมือน' : 'ไม่เหมือน'}</Text>
                    <Image style={{width: width * 0.8, height: width * 0.8, borderRadius: 5, marginVertical: 5}} source={{uri: data.choice6.url}}/>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 7 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 7 {data.choice7.title}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>คำตอบ: {data.choice7.anstext}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 8 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 8 {data.choice8.title}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 8.1: {data.choice8.sub1}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice8.is1True ? "ถูก" : "ผิด"}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 8.2: {data.choice8.sub2}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice8.is2True ? "ถูก" : "ผิด"}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 9 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 9 {data.choice9.title}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice9.isTrue ? "ถูก" : "ผิด"}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 10 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 10 {data.choice10.title}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>คำตอบ {data.choice10.ans1} {data.choice10.ans2} {data.choice10.ans3} {data.choice10.ans4} {data.choice10.ans5}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>คำตอบ {data.choice10.key1} {data.choice10.key2} {data.choice10.key3} {data.choice10.key4} {data.choice10.key5}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 11 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 11 {data.choice11.title}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 11.1: {data.choice11.sub1}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice11.is1True ? "ถูก" : "ผิด"}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 11.2: {data.choice11.sub2}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice11.is2True ? "ถูก" : "ผิด"}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 12 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 12 {data.choice12.title}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice12.isTrue ? "ถูก" : "ผิด"}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 13 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 13 {data.choice13.title}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 13.1: {data.choice13.sub1}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice13.is1True ? "ถูก" : "ผิด"}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 13.2: {data.choice13.sub2}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice13.is2True ? "ถูก" : "ผิด"}</Text>
                    <View style={{height: 4, width: 'auto', backgroundColor: '#f0f0f0', marginBottom: 10}}></View>

                    {/* 14 */}
                    <Text style={[styles.textStyle, {fontWeight: '300', fontWeight: 'bold'}]}>ข้อ 14 {data.choice14.title}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 14.1: {data.choice14.sub1}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice14.is1True ? "ถูก" : "ผิด"}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 14.2: {data.choice14.sub2}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice14.is2True ? "ถูก" : "ผิด"}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 14.3: {data.choice14.sub3}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice14.is3True ? "ถูก" : "ผิด"}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 14.4: {data.choice14.sub4}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice14.is4True ? "ถูก" : "ผิด"}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ข้อ 14.5: {data.choice14.sub5}</Text>
                    <Text style={[styles.textStyle, {fontWeight: '300'}]}>ความถูกต้อง {data.choice14.is5True ? "ถูก" : "ผิด"}</Text>
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
                {data.type === 'test-v2' ? <Text style={[styles.textStyle, {fontWeight: "bold", paddingBottom: 10}]}>คะแนน: {data.total_score}/30</Text> : null}
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