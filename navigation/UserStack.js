import React from 'react';
import { View } from '../components';
import { Text } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import { UserScreen, UpdateUser } from '../screens';
import { PatientTest2 } from '../screens/patient/Test2Page/PatientTest2';
import { PatientSimpleTest } from '../screens/patient/PatientSimpleTest';
import ChatScreen from '../screens/patient/ChatScreen';

import { userInfoAtom } from '../store';
import { useRecoilValue } from 'recoil';

const Stack = createStackNavigator();

export const UserStack = () => {
  const userInfo = useRecoilValue(userInfoAtom);
  
  return (
    <>
        {userInfo.person_type === 'patient' ? 
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='UserInfo' component={UserScreen} />
          <Stack.Screen name='UpdateUser' component={UpdateUser} />
          <Stack.Screen name='DoTestMOCA' component={PatientTest2}/>
          <Stack.Screen name='DoSimpleTest' component={PatientSimpleTest}/>
          <Stack.Screen name='Chat' component={ChatScreen}/>
        </Stack.Navigator> : 
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='UserInfo' component={UserScreen} />
          <Stack.Screen name='UpdateUser' component={UpdateUser} />
        </Stack.Navigator>}
    </>
  );
};