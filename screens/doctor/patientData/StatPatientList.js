import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, ScrollView, Dimensions, Pressable} from 'react-native'
import { View, LoadingIndicator } from '../../../components'
import { onSnapshot, query, where, orderBy, doc, collection } from "firebase/firestore"; 
import { Colors, db } from '../../../config';
import { listLastSevenDays, userInfoAtom } from '../../../store';
import { Snapshot, useRecoilState, useRecoilValue } from 'recoil';
import { Ionicons } from '@expo/vector-icons';
const {width} = Dimensions.get('window');

// todo
// update alzheimer_stat_status
// get percent done not done
// graph

export default function StatPatientList({ navigation, route }) {
    const { patientInfo } = route.params; 

    const doctorInfo = useRecoilValue(userInfoAtom)
    const [percent, setPercent] = useState({})
    const [loading, setLoading] = useState(true)
    const [processdata, setData] = useState({})

    useEffect(() => {
        // effect
        setLoading(true)
        // set date
        let currentday = new Date();
        currentday.setHours(0,0,0,0)
        let last7day = new Date();
        last7day.setHours(0,0,0,0);
        last7day.setDate(last7day.getDate() - 7);

        const percentRef = doc(db ,"users", doctorInfo.uid, "all-patients", patientInfo.uid);
        const unsub = onSnapshot(percentRef, (snapshot) => {
            // Object {
            //   "percent_good": 25,
            //   "percent_list": 75,
            //   "percent_medium": 50,
            //   "uid": "wx4pbvu3glhDhQzzN0ng3yRf3NI3",
            // }
            setPercent(snapshot.data())
        })


        // how to query in subcollection
        const docRef = doc(db, "users", patientInfo.uid);
        const collRef = collection(docRef, "List");

        // last 7 day
        const q2 = query(
            collRef, 
            where("date_millisecconds", "<=", currentday.getTime()),
            where("date_millisecconds", ">=", last7day.getTime()), 
            orderBy("date_millisecconds", "desc")
        )
        const unsubscribe = onSnapshot(q2, (qureySnapshot) => {
            processData(qureySnapshot.docs)
            setLoading(false)
        });


        return () => {
            // cleanup
            unsub();
            unsubscribe();
        }
    }, [])

    const processData = (docs) => {
        let arraytime = []
        let day = new Date();
        day.setHours(0,0,0,0);
        day.setDate(day.getDate() - 7);

        for (let i = 0; i < 7; i++) { //0,...,7
            arraytime[i] = day.getTime()
            // console.log(day.toLocaleString());
            day.setDate(day.getDate() + 1);
        }

        let alldata = {
            day1: {
                data: [],
                percent: 0,
                isnull: true
            },
            day2: {
                data: [],
                percent: 0,
                isnull: true
            },
            day3: {
                data: [],
                percent: 0,
                isnull: true
            },
            day4: {
                data: [],
                percent: 0,
                isnull: true
            },
            day5: {
                data: [],
                percent: 0,
                isnull: true
            },
            day6: {
                data: [],
                percent: 0,
                isnull: true
            },
            day7: {
                data: [],
                percent: 0,
                isnull: true
            }
        }

        docs.map(doc => {
            const millisec = doc.data().date_millisecconds
            if (millisec >= arraytime[6]) {
                // day7
                alldata.day7.data.push(doc.data())
                alldata.day7.percent = getPercent(alldata.day7.data)
                alldata.day7.isnull = alldata.day7.data.length > 0 ? false : true
            } else if (millisec >= arraytime[5]) {
                // day6
                alldata.day6.data.push(doc.data())
                let percentDone = getPercent(alldata.day6.data)
                alldata.day6.percent = percentDone
                alldata.day6.isnull = alldata.day6.data.length > 0 ? false : true
            } else if (millisec >= arraytime[4]) {
                // day5
                alldata.day5.data.push(doc.data())
                let percentDone = getPercent(alldata.day5.data)
                alldata.day5.percent = percentDone
                alldata.day5.isnull = alldata.day5.data.length > 0 ? false : true
            } else if (millisec >= arraytime[3]) {
                // day4
                alldata.day4.data.push(doc.data())
                let percentDone = getPercent(alldata.day4.data)
                alldata.day4.percent = percentDone
                alldata.day4.isnull = alldata.day4.data.length > 0 ? false : true
            } else if (millisec >= arraytime[2]) {
                // day3
                alldata.day3.data.push(doc.data())
                let percentDone = getPercent(alldata.day3.data)
                alldata.day3.percent = percentDone
                alldata.day3.isnull = alldata.day3.data.length > 0 ? false : true
            } else if (millisec >= arraytime[1]) {
                // day2
                alldata.day2.data.push(doc.data())
                let percentDone = getPercent(alldata.day2.data)
                alldata.day2.percent = percentDone
                alldata.day2.isnull = alldata.day2.data.length > 0 ? false : true
            } else {
                // day1
                alldata.day1.data.push(doc.data())
                let percentDone = getPercent(alldata.day1.data)
                alldata.day1.percent = percentDone
                alldata.day1.isnull = alldata.day1.data.length > 0 ? false : true
            }
        })

        setData(alldata)
        // console.log(alldata);
    }

    const getPercent = (array) => {
        if (array.length === 0) {
            return -1
        }
        let done = 0
        let ndone = 0
        array.map(e => {
            if (e.isDone === true) {
                done += 1;
            } else {
                ndone += 1;
            }
        })

        // console.log("percent", (ndone/(done+ndone)) * 100);
        return (ndone/(done+ndone)) * 100
    }

    return (
        <View isSafe style={styles.container}>
            <View style={styles.viewHeader}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                </Pressable>
                <Text style={styles.textHeader}>สถิติของ {patientInfo.firstname} {patientInfo.lastname}</Text>
            </View>
            {/* <Text>{JSON.stringify(processdata)}</Text> */}
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
