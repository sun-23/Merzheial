import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native'
import { View, LoadingIndicator } from '../../components'

import { onSnapshot, collection } from "firebase/firestore"; 
import { Colors, db, auth } from '../../config';
const {width} = Dimensions.get('window');

import { familyLists } from '../../store';
import { useRecoilState } from 'recoil';

export default function PatientFamily({ navigation }) {

    const [famillyLists ,setLists] = useRecoilState(familyLists)
    
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // effect
        setLoading(true)

        const collRef = collection(db, "users", auth.currentUser.uid, "RelationshipLists")
        // query not working in sub collection
        // const q = query(collRef, where("day", ">=", new Date()), orderBy("day"))
        const unsubscribe = onSnapshot(collRef, (snapshot) => {
            setLists(snapshot.docs.map((doc) => doc.data()))
            setLoading(false)
        });

        return () => {
            // cleanup
            unsubscribe()
        }
    }, [])

    const RenderItemAll = () => {
        return famillyLists.map(item => {
            return <View 
                        key={item.id}
                        style={styles.item}
                    >
                        {!item.imageUrl ? 
                            <Image 
                                style={styles.image}  
                                source={require('../../assets/avatar.webp')}
                            /> : 
                            <Image 
                                style={styles.image} 
                                source={{uri: item.imageUrl}}
                            />}
                        <View style={styles.itemViewText}>
                            <Text style={styles.itemTitle}>{item.name} {item.lastname}</Text>
                            <Text style={styles.itemTitle}>{item.relations}</Text>
                            <Text style={styles.itemTitle}>phone number: {item.phone}</Text>
                        </View>
                    </View>
        })
    }

    return (
        <View isSafe style={styles.container}>
            <Text style={styles.header}>list of acquaintances</Text>
            <TouchableOpacity 
                style={styles.btn} 
                onPress={() => navigation.navigate("New-person")}
            >
                <Text style={{color: 'white'}}>add acquaintance</Text>
            </TouchableOpacity>
            {!loading ? (<ScrollView>
                <View style={{height: 4, width: width, backgroundColor: '#f0f0f0'}}></View>
                <RenderItemAll/>
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
        height: 'auto',
        paddingHorizontal: width * 0.05,
        borderBottomWidth: 4,
        borderColor: '#f0f0f0',
        paddingBottom: 5,
        flexDirection: 'row'
    },
    itemTitle:{
        fontSize: 20,
        fontWeight: '600',
    },
    itemViewText: {
        alignSelf: 'center', 
        paddingLeft: 10
    },
    image: {
        height: 70, 
        width: 70, 
        borderRadius: 5,
        marginVertical: 12,
        alignSelf: 'flex-start'
    }
})

