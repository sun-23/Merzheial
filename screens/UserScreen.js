import React from 'react'
import { StyleSheet, Text, Image, ScrollView, Dimensions } from 'react-native'
import { Colors } from '../config';
import { View, Button } from '../components'

import { useRecoilValue } from 'recoil';
import { userInfoAtom } from '../store';
import { auth } from '../config';
import { signOut } from '@firebase/auth';

const {height, width} = Dimensions.get('window');

export const UserScreen = ({ navigation }) => {
    const userInfo = useRecoilValue(userInfoAtom);
    return (
      <ScrollView>
        <View isSafe style={styles.container}>
            <Text style={styles.screenTitle}>user information</Text>
            {/* <Text>{JSON.stringify(userInfo)}</Text> */}
            {userInfo.urlImage ? 
              <Image 
                source={{ uri: userInfo.urlImage }} 
                style={{ 
                  width: 200, 
                  height: 200, 
                  borderRadius: 100, 
                  marginVertical: 10, 
                  alignSelf: 'center' 
                }} 
              /> : 
              <Image 
                source={require('../assets/avatar.webp')} 
                style={{ 
                  width: 200, 
                  height: 200, 
                  borderRadius: 100, 
                  marginVertical: 10, 
                  alignSelf: 'center' 
                }} 
              />
            }
            <Text style={[styles.text, {fontWeight: 'bold', alignSelf: 'center', fontSize: 30}]}>{userInfo.firstname} {userInfo.lastname}</Text>
            <Text style={[styles.text, {alignSelf: 'center', color: "#404040"}]}>UID:{userInfo.uid}</Text>
            <View style={{width: '100%', height: 10}}></View>
            <View style={styles.patientInfo}>
              <Text style={styles.text}>email: {userInfo.email}</Text>
              <Text style={styles.text}>age: {userInfo.age} years</Text>
              <Text style={styles.text}>sex: {userInfo.sex_type == 'female' ? 'female' : 'male'}</Text>
            </View>
            <View  style={{width: '100%', height: 20}}></View>
            {/* patient */}
            {userInfo.person_type === 'patient' ? 
              <View style={styles.patientInfo}>
                <Text style={[styles.text, {color: (userInfo.address !== "") ? "black" : "red"}]}>address: {userInfo.address !== "" ? userInfo.address : "Please specify"}</Text>
                <Text style={[styles.text, {color: (userInfo.like !== "") ? "black" : "red"}]}>like: {userInfo.like !== "" ? userInfo.like : "Please specify"}</Text>
                <Text style={[styles.text, {color: (userInfo.unlike !== "") ? "black" : "red"}]}>not like: {userInfo.unlike !== "" ? userInfo.unlike : "Please specify"}</Text>
                <Text style={[styles.text, {color: (userInfo.allergy !== "") ? "black" : "red"}]}>allergy: {userInfo.allergy !== "" ? userInfo.allergy : "Please specify"}</Text>
                <Text style={[styles.text, {color: (userInfo.alzheimer_lv !== "") ? "black" : "red"}]}>stage of symptoms: {userInfo.alzheimer_lv !== "" ? userInfo.alzheimer_lv : "Please have a doctor evaluate."}</Text>
                <Text style={[styles.text, {color: (userInfo.medicine !== "") ? "black" : "red"}]}>medication to take: {userInfo.medicine !== "" ? userInfo.medicine : "Please have a doctor evaluate."}</Text>
              </View> :
            null}

            <View  style={{width: '100%', height: 10}}></View>

            {/* patient test */}
            {userInfo.person_type === 'patient' ? 
              <Button
                style={styles.button}
                onPress={() => navigation.navigate('Chat')}
              >
                <Text style={styles.buttonText}>chat with doctor</Text>
              </Button>
              :
            null}
            {userInfo.person_type === 'patient' ? 
              <Button
                style={styles.button}
                onPress={() => navigation.navigate('DoTestMOCA')}
              >
                <Text style={styles.buttonText}>take the moca quiz</Text>
              </Button> :
            null}
            {userInfo.person_type === 'patient' ? 
              <Button
                style={styles.button}
                onPress={() => navigation.navigate('DoSimpleTest')}
              >
                <Text style={styles.buttonText}>take quiz questions</Text>
              </Button> :
            null}

            <Button
                style={styles.button}
                onPress={() => navigation.navigate('UpdateUser')}
            >
              <Text style={styles.buttonText}>change user information</Text>
            </Button>
            <Button
                style={styles.button}
                onPress={() => {
                    signOut(auth);
                }}
            >
                <Text style={styles.buttonText}>Sign out</Text>
              </Button>
        </View>
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'flex-start',
    minHeight: height,
    paddingHorizontal: width * 0.1
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.black,
    paddingTop: 20,
    alignSelf: 'center'
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f57c00',
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700'
  },
  text: {
    fontSize: 20,
  },
  patientInfo: {
    alignSelf: 'center',
    width: '100%',
    height: 'auto',
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    // shadow
    shadowRadius: 2.62,
    shadowOpacity: 0.23,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    elevation: 4,
  }
});
