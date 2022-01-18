import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserStack } from './UserStack';

// caretaker screen
import CareTakerHomeStack from './CareTakerHomeStack';

// doctor screen
import DoctorHomeStack from './DoctorHomeStack';

// patient screen
import { PatientSocialScreen } from '../screens';
import { PatientSimpleTest } from '../screens/patient/PatientSimpleTest';
import { PatientTest2 } from '../screens/patient/Test2Page/PatientTest2';
import PatientListStack from './PatientListStack';
import PatientStatStack from './PatiantStatStack';
import { FamilyStack } from './PatientFamilyStack';

import { userInfoAtom, dayAtom } from '../store';
import { useRecoilState } from 'recoil';
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from '../config';
import { LoadingIndicator, View } from '../components';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export const AppStack = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [curDay, setDay] = useRecoilState(dayAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeUserInfo = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      console.log("user Info data: ", doc.data());
      setUserInfo(doc.data());
      setIsLoading(false);
    },(error) => {
      console.log("error user info", error);
    });

    setDay(() => {
        var d = new Date()
        d.setHours(0)
        d.setMinutes(0)
        d.setSeconds(0)
        return d.getTime()
    })

    var a = curDay
    console.log("curDay ==>", a.toString());

    return () => {
      unsubscribeUserInfo();
    }
  }, [])

  if (isLoading) {
    return <LoadingIndicator />
  }

  if (userInfo.person_type === 'doctor') {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name='หน้าแรก' component={DoctorHomeStack} />
        <Tab.Screen name='ผู้ใช้' component={UserStack} />
      </Tab.Navigator>
    );
  } else if (userInfo.person_type === 'caretaker') {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name='หน้าแรก' component={CareTakerHomeStack} />
        <Tab.Screen name='ผู้ใช้' component={UserStack} />
      </Tab.Navigator>
    )
  } else if (userInfo.person_type === 'patient' && !userInfo.isTest) {
    return (
      <PatientTest2 />
    )
  } else if (userInfo.person_type === 'patient' && userInfo.isTest) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName="หน้าแรก">
        {/* todo
          create web game and like to it
         */}
        <Tab.Screen name='social' component={PatientSocialScreen}/>
        <Tab.Screen name='สถิติ' component={PatientStatStack}/>
        <Tab.Screen name='หน้าแรก' component={PatientListStack}/>
        <Tab.Screen name='ญาติ' component={FamilyStack}/>
        <Tab.Screen name='ผู้ใช้' component={UserStack}/>
      </Tab.Navigator>
    );
  }

  return (
    <View isSafe>
      <Text>Person type invalid!</Text>
    </View>
  )
};
