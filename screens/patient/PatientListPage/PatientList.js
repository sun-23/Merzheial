import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import { View, LoadingIndicator } from '../../../components'
import { ButtonGroup } from 'react-native-elements';
import { onSnapshot, query, where, orderBy, doc, collection } from "firebase/firestore"; 
import { Colors, db, auth } from '../../../config';
import { userListsAtom, userListsDone, userListsNotDone, dayAtom , listLastSevenDays} from '../../../store';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
const {width} = Dimensions.get('window');

export default function PatientList({ navigation }) {

    const setListAtom = useSetRecoilState(userListsAtom)
    const [last7Lists, setL7DS] = useRecoilState(listLastSevenDays)
    const doneLists = useRecoilValue(userListsDone)
    const notDoneLists = useRecoilValue(userListsNotDone)
    const curDay = useRecoilValue(dayAtom)


    const [indexSelect, setIndex] = useState(2)
    const [loading, setLoading] = useState(true)
    const buttonsSelect = ['done', 'not done yet', '7 days ago']

    useEffect(() => {
        // effect
        setLoading(true)

        // how to query in subcollection
        const docRef = doc(db, "users", auth.currentUser.uid);
        const collRef = collection(docRef, "List");
        let currentday = new Date();
        currentday.setHours(0,0,0,0)

        // this day to after
        const q = query(
            collRef, 
            where("date_millisecconds", ">=", currentday.getTime()), 
            orderBy("date_millisecconds", "asc")
        )
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setListAtom(querySnapshot.docs.map((doc) => doc.data()))
            setLoading(false)
        });

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
        const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
            setL7DS(querySnapshot.docs.map((doc) => doc.data()))
            setLoading(false)
        });

        return () => {
            // cleanup
            unsubscribe()
            unsubscribe2();
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
        return last7Lists.map(item => {
            return <TouchableOpacity 
                        key={item.id}
                        style={styles.item}
                        onPress={() => navigation.navigate("Item", { data: item })}
                    >
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        {/* show status */}
                        <Text style={[styles.itemTitle, {color: (item.isDone) ? "#00bf0b" : "red" }]}>{(item.isDone) ? "done" : "forgot" }</Text>
                        <Text style={styles.itemTime}>{item.day_string}</Text>
                    </TouchableOpacity>
        })
    }

    const SwichRender = () => {
        switch (buttonsSelect[indexSelect]) {
            case 'done':
                return <RenderItemDone/>
            case 'not done yet':
                return <RenderItemNotDone/>
            case '7 days ago':
                return <RenderItemAll/>
            default:
                break;
        }
    }

    return (
        <View isSafe style={styles.container}>
            <Text style={styles.header}>todo list</Text>
            <TouchableOpacity 
                style={styles.btn} 
                onPress={() => navigation.navigate("Create_new")}
            >
                <Text style={{color: 'white'}}>new item</Text>
            </TouchableOpacity>
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
        fontSize: 30,
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
    }
})
