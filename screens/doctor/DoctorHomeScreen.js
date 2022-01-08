import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, Image, Dimensions, ScrollView } from 'react-native'
import { View, Button } from '../../components'
import { Colors, db } from '../../config';
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import AsyncSelect from 'react-select/async';
import { userInfoAtom } from '../../store';
const {width, height} = Dimensions.get('window');


// add patient and list patient
export const DoctorHomeScreen = ({navigation}) => {
  return (
    <View isSafe style={styles.container}>
      <Text>doctor</Text>
    </View>
  );
};

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
        justifyContent: 'center',
        width: width*0.9,
        height: 50,
        borderRadius: 5,
        marginVertical: 10
    },
    buttonOpen: {
        backgroundColor: Colors.orange,
    },
    buttonSummit: {
        backgroundColor: '#1597e5',
    },
    textStyle: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "left",
        alignSelf: 'flex-start'
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
})

