import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, ScrollView, Dimensions, Pressable} from 'react-native'
import { View, LoadingIndicator } from '../../../components'
import { onSnapshot, query, where, orderBy, doc, collection } from "firebase/firestore"; 
import { Colors, db } from '../../../config';
import { listLastSevenDays} from '../../../store';
import { useRecoilState } from 'recoil';
import { Ionicons } from '@expo/vector-icons';
const {width} = Dimensions.get('window');

// todo
// update alzheimer_stat_status
// get percent done not done
// graph

export default function StatPatientList({ navigation, route }) {
    const { patientInfo } = route.params; 

    const [last7Lists, setL7DS] = useRecoilState(listLastSevenDays)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // effect
        setLoading(true)

        // how to query in subcollection
        const docRef = doc(db, "users", patientInfo.uid);
        const collRef = collection(docRef, "List");
        let currentday = new Date();
        currentday.setHours(0,0,0,0)

        let last7day = new Date();
        last7day.setHours(0,0,0,0);
        last7day.setDate(last7day.getDate() - 7);

        // last 7 day
        const q2 = query(
            collRef, 
            where("date_millisecconds", "<=", currentday.getTime()),
            where("date_millisecconds", ">=", last7day.getTime()), 
            orderBy("date_millisecconds", "desc")
        )
        const unsubscribe = onSnapshot(q2, (qureySnapshot) => {
            setL7DS(qureySnapshot.docs.map((doc) => doc.data()))
            setLoading(false)
        });

        return () => {
            // cleanup
            unsubscribe();
        }
    }, [])

    return (
        <View isSafe style={styles.container}>
            <View style={styles.viewHeader}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                </Pressable>
                <Text style={styles.textHeader}>สถิติของ {patientInfo.firstname} {patientInfo.lastname}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        backgroundColor: 'white',
        // justifyContent: 'center'
    },
    textHeader: {
        fontWeight: 'bold', 
        fontSize: 20,
        marginLeft: 20,
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
    item:{
        width: width,
        height: 90,
        paddingHorizontal: width * 0.05,
        borderBottomWidth: 4,
        borderColor: '#f0f0f0',
        justifyContent: 'center'
    },
    itemTitle:{
        fontSize: 20,
        fontWeight: '600'
    },
    itemTime: {
        fontSize: 16,
        fontWeight: '400'
    },
    viewHeader: {
        width: width*0.9,
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center'
    },
})
