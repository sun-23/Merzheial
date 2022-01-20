import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import { View, LoadingIndicator } from '../../../components'
import { ButtonGroup } from 'react-native-elements';

import { onSnapshot, collection } from "firebase/firestore"; 
import { Colors, db } from '../../../config';
const {width, height} = Dimensions.get('window');

import { userListsAtom, userListsDone, userListsNotDone, sortListsSelector, dayAtom } from '../../../store';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export default function CTakerPatientList({ navigation, route }) {
    const { patientInfo } = route.params; 

    const setListAtom = useSetRecoilState(userListsAtom)
    const sortLists = useRecoilValue(sortListsSelector)
    const doneLists = useRecoilValue(userListsDone)
    const notDoneLists = useRecoilValue(userListsNotDone)
    const curDay = useRecoilValue(dayAtom)

    const [indexSelect, setIndex] = useState(2)
    const [loading, setLoading] = useState(true)
    const buttonsSelect = ['ผู้ป่วยทำเสร็จแล้ว', 'ผู้ป่วยยังไม่ได้ทำ', 'รวมทั้งหมดตั้งแต่ต้นจนถึงหลัง 7 วันเป็นต้นไป']

    useEffect(() => {
        // effect
        setLoading(true)

        const collRef = collection(db, "users", patientInfo.uid, "List")
        // query not working in sub collection
        // const q = query(collRef, where("day", ">=", new Date()), orderBy("day"))
        const unsubscribe = onSnapshot(collRef, (snapshot) => {
            setListAtom(snapshot.docs.map((doc) => doc.data()))
            setLoading(false)
        });

        return () => {
            // cleanup
            unsubscribe()
        }
    }, [])

    const onSelectIndex = (i) => {
        setIndex(i);
    }

    const RenderItemDone = () => {
        return doneLists.map(item => {
            return <TouchableOpacity 
                        key={item.id}
                        style={styles.item}
                        onPress={() => navigation.navigate("Item", { data: item })}
                    >
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        {/* <Text style={styles.itemTime}>{(new Date(item.day.seconds * 1000)).toString()}</Text> */}
                        <Text style={styles.itemTime}>{item.day_string}</Text>
                    </TouchableOpacity>
        })
    }

    const RenderItemNotDone = () => {
        return notDoneLists.map(item => {
            return <TouchableOpacity 
                        key={item.id}
                        style={styles.item}
                        onPress={() => navigation.navigate("Item", { data: item })}
                    >
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        {/* <Text style={styles.itemTime}>{(new Date(item.day.seconds * 1000)).toString()}</Text> */}
                        <Text style={styles.itemTime}>{item.day_string}</Text>
                    </TouchableOpacity>
        })
    }

    const RenderItemAll = () => {
        return sortLists.map(item => {
            return <TouchableOpacity 
                        key={item.id}
                        style={styles.item}
                        onPress={() => navigation.navigate("Item", { data: item })}
                    >
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        {/* show status */}
                        <Text style={[styles.itemTitle, {color: (item.isDone) ? "#00bf0b" : ((curDay - (item.day.seconds * 1000) > 0) ? "red" : "#fbbf00")}]}>{(item.isDone) ? "ทำแล้ว" : ((curDay - (item.day.seconds * 1000) >= 0) ? "ยังไม่ได้ทำ" : "ลืมทำ")}</Text>
                        <Text style={styles.itemTime}>{item.day_string}</Text>
                    </TouchableOpacity>
        })
    }

    const SwichRender = () => {
        switch (buttonsSelect[indexSelect]) {
            case 'ผู้ป่วยทำเสร็จแล้ว':
                return <RenderItemDone/>
            case 'ผู้ป่วยยังไม่ได้ทำ':
                return <RenderItemNotDone/>
            case 'รวมทั้งหมดตั้งแต่ต้นจนถึงหลัง 7 วันเป็นต้นไป':
                return <RenderItemAll/>
            default:
                break;
        }
    }

    return (
        <View isSafe style={styles.container}>
            <Text style={styles.header}>สิ่งที่ต้องทำของ {patientInfo.firstname} {patientInfo.lastname}</Text>
            <ButtonGroup
                onPress={onSelectIndex}
                selectedIndex={indexSelect}
                buttons={buttonsSelect}
                containerStyle={{height: 70, marginBottom: 12, padding: 5}}
            />
            {!loading ? (<ScrollView>
                <View style={{height: 4, width: width, backgroundColor: '#f0f0f0'}}></View>
                <SwichRender/>
            </ScrollView>) : <LoadingIndicator/>}
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
    header: {
        fontWeight: 'bold', 
        fontSize: 25,
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 10,
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
        height: 70,
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
