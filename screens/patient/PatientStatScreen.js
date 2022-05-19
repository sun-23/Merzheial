import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { View } from '../../components';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from '../../config';
import { listLastSevenDays, userInfoAtom, userMeetDocs } from '../../store';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ScrollView } from 'react-native-gesture-handler';
const {width} = Dimensions.get('window');

// show list stat last 7 days done and not done
export const PatientStatScreen = ({navigation}) => {

  const [numDone, setNumDone] = useState(0);
  const [numNotDone, setNumNotDone] = useState(0);
  const list = useRecoilValue(listLastSevenDays);
  const userInfo = useRecoilValue(userInfoAtom);
  const meetDoctors= useRecoilValue(userMeetDocs);
  const setMeetDoctors = useSetRecoilState(userMeetDocs);

  useEffect(() => {
    // effect
    var numD = 0
    var numND = 0
    list.map(e => {
      if (e.isDone === true) {
        numD = numD + 1; 
      } else {
        numND = numND + 1;
      }
    })
    setNumDone(numD)
    setNumNotDone(numND)

    let last7day = new Date();
    last7day.setHours(0,0,0,0)
    last7day.setDate(last7day.getDate() - 7);

    const docmeetRef = collection(db, "meet_doctor");
    const q = query(
      docmeetRef,  
      where("uid_patient", "==", userInfo.uid), 
      where("time_milisecconds", ">=", last7day.getTime()), 
      orderBy("time_milisecconds", "asc")
    )
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMeetDoctors(querySnapshot.docs.map((doc) => /**/({id: doc.id, ...doc.data()})/**/))
    });

    return () => {
      // cleanup
      unsubscribe()
    }
  }, [])

  return (
    <View isSafe style={styles.container}>
      <Text style={styles.header}>Statistic 7 days ago</Text>
      <View style={styles.stat_view}>
        <View style={styles.stat_item}>
          <Text style={styles.numSize}>{numDone}</Text>
          <Text style={styles.stat_text}>done</Text>
        </View>
        <View style={styles.stat_item}>
          <Text style={styles.numSize}>{numNotDone}</Text>
          <Text style={styles.stat_text}>did not do</Text>
        </View>
      </View>
      <Text style={styles.stat_text}>list of appointments with the doctor</Text>
      <ScrollView>
        <View style={{height: 4, width: width, backgroundColor: '#f0f0f0'}}></View>
        {meetDoctors.map((data) => {
          return <TouchableOpacity 
                    key={data.id}
                    style={styles.item}
                    onPress={() => navigation.navigate("MeetDocDesc", { data: data })}
                >
                    <Text style={styles.itemTitle}>{data.title}</Text>
                    <Text style={styles.itemTime}>แพทย์: {data.doctor_name}</Text>
                    {/* (new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(data.item.time.seconds * 1000)))).toString() */}
                    <Text style={styles.itemTime}>{(new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(data.time.seconds * 1000)))).toString()}</Text>
                </TouchableOpacity>
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        backgroundColor: 'white',
        // justifyContent: 'center'
    },
    header: {
        fontWeight: 'bold', 
        fontSize: 30,
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 10,
    },
    stat_view: {
      width: width*0.9,
      height: 'auto',
      paddingVertical: 12,
      backgroundColor: "white",
      borderRadius: 5,
      alignContent: "center",
      flexDirection: "row",
      justifyContent: "space-evenly",
      shadowRadius: 2.62,
      shadowOpacity: 0.23,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      elevation: 4,
      marginBottom: 12
    },
    stat_item: {
      width: width* 0.35,
      justifyContent: 'center',
      alignItems: 'center'
    },
    numSize: {
      fontSize: 100,
      fontWeight: '700'
    },
    stat_text: {
      fontWeight: "500",
      fontSize: 20
    },
    item:{
        width: width,
        height: 100,
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
    }
})
