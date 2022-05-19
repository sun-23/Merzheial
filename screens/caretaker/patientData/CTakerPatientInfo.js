import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, Dimensions, ScrollView, Pressable } from 'react-native'
import { View, Button } from '../../../components'
import { Colors, db } from '../../../config';
import { collection, query, where, onSnapshot, doc, orderBy } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { currentPatientMeetDocs } from '../../../store';
import { Ionicons } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');

const CTakerPatientInfo = ({navigation, route}) => {
    const { patientInfo } = route.params; 

    const [currentPatientMeet,setCurrentPatientMeet] = useRecoilState(currentPatientMeetDocs);
    const [patientFireInfo, setPatientFireInfo] = useState();

    useEffect(() => {
        // effect

        const docRef = doc(db, "users", patientInfo.uid);
        let last7day = new Date();
        last7day.setHours(0,0,0,0)
        last7day.setDate(last7day.getDate() - 7);

        const unsubscribeUserRef = onSnapshot(docRef, (doc) => {
            // console.log("ddddd",/**/({id: doc.id, ...doc.data()})/**/);
            setPatientFireInfo(/**/({id: doc.id, ...doc.data()})/**/);
        });

        const collectionMeetRef = collection(db, "meet_doctor");
        const q = query(
            collectionMeetRef,  
            where("uid_patient", "==", patientInfo.uid), 
            where("time_milisecconds", ">=", last7day.getTime()), 
            orderBy("time_milisecconds", "asc")
        )
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
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                </Pressable>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <Button
                        style={{paddingRight: 5}} 
                        title='test results'
                        borderless
                        onPress={() => navigation.navigate("Tests", { patientInfo: patientInfo })}
                    />
                    <Button
                        style={{paddingRight: 5}} 
                        title='chat room with patient'
                        borderless
                        onPress={() => navigation.navigate("Chat", { patientInfo: patientInfo })}
                        // ทำ screen list all test
                        // ทำ test info
                    />
                    <Button
                        style={{paddingRight: 5}} 
                        title='activity'
                        borderless
                        onPress={() => navigation.navigate("List", { patientInfo: patientFireInfo })}
                    />
                </View>
            </View>
           
            <View style={styles.content}>
                <Text style={[styles.textHeader, {alignSelf: 'flex-start'}]}>patients</Text>
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
                            <Text style={styles.itemTitle}>first name: {patientFireInfo.firstname}</Text>
                            <Text style={styles.itemTitle}>last name: {patientFireInfo.lastname}</Text>
                            <Text style={styles.itemTitle}>age: {patientFireInfo.age}years sex: {patientFireInfo.sex_type === "female" ? "female" : "male"}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>like {patientFireInfo.like}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>not like {patientFireInfo.unlike}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>allergy {patientFireInfo.allergy}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>address {patientFireInfo.address}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>uid: {patientFireInfo.uid}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3, color: (patientFireInfo.alzheimer_lv !== "") ? "black" : "red"}]}>state: {patientFireInfo.alzheimer_lv !== "" ? patientFireInfo.alzheimer_lv : "Please have a doctor evaluate."}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3, color: (patientFireInfo.medicine !== "") ? "black" : "red"}]}>medication to take: {patientFireInfo.medicine !== "" ? patientFireInfo.medicine : "Please have a doctor evaluate."}</Text>
                        </ScrollView>
                    </View>
                </View>}
            </View>
            <Text style={styles.textStyle}>appointment list</Text>
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