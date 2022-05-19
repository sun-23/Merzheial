import React, {useEffect} from 'react'
import { StyleSheet, Text, Dimensions, ScrollView, Pressable } from 'react-native'
import { View } from '../../../components'
import { Colors, db } from '../../../config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { currentPatientTests } from '../../../store';
import { Ionicons } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');

const PatientTests = ({navigation, route}) => {
    const { patientInfo } = route.params; 

    const [sortCurrentPatientTests,setCurrentPatienTests] = useRecoilState(currentPatientTests);

    useEffect(() => {
        // effect
        const collectionTests = collection(db, "users", patientInfo.uid, "patient_test");
        const q = query(collectionTests, orderBy("time_miliseconds", "desc"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setCurrentPatienTests(snapshot.docs.map((doc) => /**/({id: doc.id, ...doc.data()})/**/));
        });
        return () => {
            // cleanup
            unsubscribe()
        }
    }, [])

    return (
        <View isSafe style={styles.container}>
            <View style={styles.viewHeader}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
                </Pressable>
                <Text style={styles.textHeader}>test results</Text>
            </View>
            <ScrollView style={{height: 'auto', width: width}}>
                <View style={{height: 4, width: width, backgroundColor: '#f0f0f0'}}></View>
                {sortCurrentPatientTests.map((data) => {
                return <Pressable 
                            key={data.id}
                            style={{
                                height: 'auto',
                                minHeight: 70,
                                width: width,
                                paddingHorizontal: width * 0.05,
                                borderBottomWidth: 4,
                                borderColor: '#f0f0f0',
                                paddingBottom: 5,
                                justifyContent: 'center'
                            }}
                            onPress={() => navigation.navigate("TestInfo", { data: data })}
                        >
                            <Text style={styles.itemTitle}>{(new Intl.DateTimeFormat("th-TH",{ dateStyle: 'full', timeStyle: 'short' }).format((new Date(data.user_time.seconds * 1000)))).toString()}</Text>
                        </Pressable>
                })}
            </ScrollView>
        </View>
    )
}

export default PatientTests

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
        height: 50,
        width: width*0.9,
        margin: 12,
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonOpen: {
        backgroundColor: Colors.orange,
    },
    buttonSummit: {
        backgroundColor: '#1597e5',
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
    itemTitle:{
      fontSize: 20,
      fontWeight: '600',
    },
})