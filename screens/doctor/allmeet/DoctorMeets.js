import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { View } from '../../../components';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from '../../../config';
import { userInfoAtom } from '../../../store';
import { useRecoilValue } from 'recoil';
import { ScrollView } from 'react-native-gesture-handler';
const {width} = Dimensions.get('window');

// show list stat last 7 days done and not done
export const DoctorMeets = ({navigation}) => {

  const userInfo = useRecoilValue(userInfoAtom);
  const [meets, setMeets] = useState([])

  useEffect(() => {
    let currentday = new Date();
    currentday.setHours(0,0,0,0)

    const docmeetRef = collection(db, "meet_doctor");
    const q = query(
      docmeetRef,  
      where("uid_doctor", "==", userInfo.uid), 
      where("time_milisecconds", ">=", currentday.getTime()), 
      orderBy("time_milisecconds", "asc")
    )
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMeets(querySnapshot.docs.map((doc) => /**/({id: doc.id, ...doc.data()})/**/))
    });

    return () => {
      // cleanup
      unsubscribe()
    }
  }, [])

  return (
    <View isSafe style={styles.container}>
      <Text style={styles.header}>นัดกับคนไข้</Text>
      <View style={{height: 4, width: width, backgroundColor: '#f0f0f0'}}></View>
      <ScrollView>
        {meets.map((data) => {
          return <TouchableOpacity 
                    key={data.id}
                    style={styles.item}
                    onPress={() => navigation.navigate("MeetDocDesc", { data: data })}
                >
                    <Text style={styles.itemTitle}>{data.title}</Text>
                    <Text style={styles.itemTime}>แพทย์: {data.paitent_name}</Text>
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
