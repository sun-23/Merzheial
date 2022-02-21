import { StyleSheet, Text, Pressable, ScrollView, Dimensions } from 'react-native'
import { View } from '../components'
import React from 'react'
import { db, auth, Colors} from '../config'
import { doc, setDoc } from 'firebase/firestore'

const {width, height} = Dimensions.get('window')

const PDPA = () => {
  return (
    <View isSafe style={styles.container}>
        <Text style={{fontSize: 30, fontWeight: '600'}}>Policy</Text>
        <ScrollView style={{paddingHorizontal: width*0.05}}>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                1. บทนำยินดีต้อนรับเข้าสู่แอพพลิเคชันเราได้จัดทำประกาศความเป็นส่วนตัวนี้เพื่อแจ้งให้ทราบถึงนโยบายความเป็นส่วนตัวรายละเอียดการรวบรวมข้อมูลใช้หรือเปิดเผยตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562“ PDPA” (Personal Data Protection Act) เพราะทางเรานั้นตระหนักถึงความสำคัญของข้อมูลลูกค้าเป็นอย่างยิ่งลูกค้าสามารถมั่นใจได้ว่าข้อมูลที่ได้มอบให้กับทางเรานั้นมีมาตรการการรักษาความมั่นคงที่เหมาะสมและปลอดภัยอย่างดีที่สุด 
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16}]}>
                2. รวบรวมข้อมูลส่วนบุคคลเมื่อใด "ข้อมูลส่วนบุคคล" หมายความว่าข้อมูลเกี่ยวกับบุคคลซึ่งทำให้สามารถระบุตัวบุคคลนั้นได้ไม่ว่าทางตรงหรือทางอ้อมโดยที่เรานั้นได้รวบรวมข้อมูลส่วนบุคคลในกรณีที่จำเป็นและใช้ข้อมูลเท่านั้น
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                2.1 เมื่อมีการสมัครสมาชิก 2.2 เมื่อมีการกรอกข้อมูลสถิติ
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                3. เก็บรวบรวมข้อมูลส่วนบุคคลใดบ้าง ประเภทของข้อมูลส่วนบุคคลจะรวบรวมใช้ตามขอบเขตของการบริการโดยรวบรวมข้อมูลเท่าที่จำเป็นและเป็นประโยชน์ภายใต้กฎหมายข้อมูลระบุตัวตนเช่นชื่อ นามสกุล เป็นต้น ข้อมูลการติดต่อเช่นอีเมล์หมายเลขโทรศัพท์ที่อยู่ทางไปรษณีย์ ข้อมูลทางธุรกรรมรายละเอียดการสั่งซื้อและชำระเงินเป็นต้นข้อมูลทางเทคนิคเช่น IP address, Cookie, Web Browser เป็นต้น
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16}]}>
                4. ใช้ข้อมูลส่วนบุคคลอย่างไร
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16}]}>
                4.1 เพื่อการติดต่อสอบถามข้อมูลซื้อขายสินค้าหรือบริการ
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16}]}>
                4.2 เพื่อการตรวจสอบรายละเอียดการสั่งซื้อสินค้า
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16}]}>
                4.3 เพื่อใช้ในการขนส่งกินค้า
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                4.4 เพื่อใช้ในการจัดทำรายงานการสั่งซื้อและรายงานภาษีการขาย
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                5. ปกป้องข้อมูลส่วนบุคคลอย่างไร ทางเรานั้นมีมาตรการการรักษาความปลอดภัยที่เข้มงวดเพื่อรองรับความปลอดภัยของข้อมูลอย่างสูงที่สุดรับรองความปลอดภัยทางอิเล็กทรอนิกส์บนมาตรฐาน SSL (Security Socket Layer) ที่อนุมัติให้แก่เว็บไซต์โดย CA (Certificate Authority) ถูกเข้ารหัสเพื่อปกป้องข้อมูลเช่นข้อมูลส่วนตัวรหัสผ่าน, หมายเลขบัตรเครดิตเป็นต้น
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                6. การเปิดเผยข้อมูลบุคคลต่อบุคคลภายนอก ในการดำเนินธุรกิจเรามีความจำเป็นต้องเปิดเผยข้อมูลส่วนบุคคลให้กับบุคคลที่สามเช่นเพื่อใช้ในทางการแพทย์ทั้งนี้เราขอรับรองว่าจะไม่นำข้อมูลส่วนบุคคลที่เราได้เก็บรวบรวมเอาไว้ไปเผยแพร่หรือทำการขายข้อมูลให้กับบุคคลภายนอกที่ไม่เกี่ยวข้องโดยเด็ดขาดยกเว้นในกรณีที่มีผลทางกฎหมาย 
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                7. ระยะเวลาการเก็บรักษาข้อมูลส่วนบุคคล เราจะเก็บรักษาข้อมูลส่วนบุคคลของท่านไว้เพียงเท่าที่กฎหมายกำหนดไว้หรือเท่าที่จำเป็นสำหรับวัตถุประสงค์ของการเก็บข้อมูลดังกล่าวเราจะลบหรือทำลายข้อมูลส่วนบุคคลเมื่อเห็นแล้วว่าการเก็บข้อมูลนั้นไม่มีความจำเป็นตามจุดประสงค์ที่ได้ระบุไว้
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                8. การแก้ไขเปลี่ยนแปลงนโยบาย การคุ้มครองข้อมูลส่วนบุคคลเราจะพิจารณาทบทวนปรับปรุงนโยบายการคุ้มครองข้อมูลส่วนบุคคลในบางครั้งเพื่อให้สอดคล้องกับการเปลี่ยนแปลงของการให้บริการการดำเนินงานภายใต้กฎหมายโดยเราจะเปิดเผยนโยบายฯ ให้ลูกค้าทราบผ่านแอพพลิคชันอย่างชัดเจนตามความเหมาะสมเมื่อมีการเยี่ยมชมแอพพลิเคชันหรือรับการบริการจากทางเราโปรดอ่านนโยบายการคุ้มครองข้อมูลส่วนบุคคลทุกครั้งเพื่อประโยชน์ของลูกค้าเอง
            </Text>
        </ScrollView>
        <Pressable onPress={() => {
            const userRef = doc(db, "users", auth.currentUser.uid)
            setDoc(userRef,{
            allowPDPA: true
            }, {merge: true})
        }} style={[styles.btn, {alignSelf: 'center', marginBottom: 40}]}>
            <Text style={[styles.textStyle, {color: "white"}]}>ยอมรับ</Text>
        </Pressable>
    </View>
  )
}

export default PDPA

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        width: width*0.9,
        height: 50,
        borderRadius: 5,
        backgroundColor: Colors.orange,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12
    },
    textStyle: {
        fontWeight: "bold",
        fontSize: 20,
    },
})