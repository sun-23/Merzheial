import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, Dimensions, ScrollView, Pressable } from 'react-native'
import { View, Button } from '../../../components'
import { db } from '../../../config';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { useRecoilValue, useRecoilState } from 'recoil';
import { sortcurrentPatientMeetDocs, currentPatientMeetDocs } from '../../../store';

const {width, height} = Dimensions.get('window');

const CTakerPatientInfo = ({navigation, route}) => {
    const { patientInfo } = route.params; 

    const [e,setCurrentPatientMeet] = useRecoilState(currentPatientMeetDocs);
    const currentPatientMeet = useRecoilValue(sortcurrentPatientMeetDocs);

    const [patientFireInfo, setPatientFireInfo] = useState();

    useEffect(() => {
        // effect

        const docRef = doc(db, "users", patientInfo.uid);

        const unsubscribeUserRef = onSnapshot(docRef, (doc) => {
            // console.log("ddddd",/**/({id: doc.id, ...doc.data()})/**/);
            setPatientFireInfo(/**/({id: doc.id, ...doc.data()})/**/);
        });

        const collectionMeetRef = collection(db, "meet_doctor");
        const q = query(collectionMeetRef, where("uid_patient", "==", patientInfo.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setCurrentPatientMeet(querySnapshot.docs.map((doc) => /**/({id: doc.id, ...doc.data()})/**/));
        });
        return () => {
            // cleanup
            unsubscribe()
            unsubscribeUserRef()
        }
    }, [])

    return (
        <View isSafe style={styles.container}>
            <View style={styles.viewHeader}>
                <Button 
                    title='กลับ'
                    borderless
                    onPress={() => navigation.goBack()}
                />
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <Button
                        style={{paddingRight: 5}} 
                        title='ผลแบบทดสอบ'
                        borderless
                        onPress={() => navigation.navigate("Tests", { patientInfo: patientInfo })}
                    />
                    <Button
                        style={{paddingRight: 5}} 
                        title='กิจกรรม'
                        borderless
                        onPress={() => navigation.navigate("List", { patientInfo: patientFireInfo })}
                    />
                </View>
            </View>
           
            <View style={styles.content}>
                <Text style={[styles.textHeader, {alignSelf: 'flex-start'}]}>คนไข้</Text>
                {patientFireInfo && <View style={[styles.item, styles.itemPatient, {maxHeight: height* 0.2}]}>
                    {!patientFireInfo.urlImage ? 
                        <Image 
                            style={[styles.image, styles.imagePatient]}  
                            source={require('../../../assets/avatar.webp')}
                        /> : 
                        <Image 
                            style={[styles.image, styles.imagePatient]} 
                            source={{uri: patientFireInfo.urlImage}}
                    />}
                    <View style={styles.itemViewText}>
                        <ScrollView>
                            <Text style={styles.itemTitle}>ชื่อ: {patientFireInfo.firstname}</Text>
                            <Text style={styles.itemTitle}>นามสกุล: {patientFireInfo.lastname}</Text>
                            <Text style={styles.itemTitle}>อายุ: {patientFireInfo.age}ปี เพศ: {patientFireInfo.sex_type === "female" ? "หญิง" : "ชาย"}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>สิ่งที่ชอบ {patientFireInfo.like}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>สิ่งที่ไม่ชอบ {patientFireInfo.unlike}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>สิ่งที่แพ้ {patientFireInfo.allergy}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>ที่อยู่ {patientFireInfo.address}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>uid: {patientFireInfo.uid}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3, color: (patientFireInfo.alzheimer_lv !== "") ? "black" : "red"}]}>ระยะอาการ: {patientFireInfo.alzheimer_lv !== "" ? patientFireInfo.alzheimer_lv : "ให้แพทย์ประเมิณ"}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3, color: (patientFireInfo.medicine !== "") ? "black" : "red"}]}>ระยะอาการ: {patientFireInfo.medicine !== "" ? patientFireInfo.medicine : "ให้แพทย์ประเมิณ"}</Text>
                        </ScrollView>
                    </View>
                </View>}
            </View>
            <Text style={styles.textStyle}>รายการนัดหมาย</Text>
            <ScrollView style={{height: 'auto', width: width}}>
                <View style={{height: 4, width: width, backgroundColor: '#f0f0f0'}}></View>
                {currentPatientMeet.map((data) => {
                return <Pressable 
                            key={data.id}
                            style={{
                                height: 'auto',
                                width: width,
                                paddingHorizontal: width * 0.05,
                                borderBottomWidth: 4,
                                borderColor: '#f0f0f0',
                                paddingBottom: 5,
                            }}
                            onPress={() => navigation.navigate("MeetInfo", { data: data })}
                        >
                            <Text style={styles.itemTitle}>{data.title}</Text>
                            {/* (new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(data.item.time.seconds * 1000)))).toString() */}
                            <Text style={styles.itemTime}>{(new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(data.time.seconds * 1000)))).toString()}</Text>
                        </Pressable>
                })}
            </ScrollView>
        </View>
    )
}

export default CTakerPatientInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        backgroundColor: 'white',
        height: height,
        // justifyContent: 'center'
    }, 
    content: {
        width: width*0.8,
        alignItems: 'center'
    },
    textStyle: {
        fontWeight: "bold",
        fontSize: 20,
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
})