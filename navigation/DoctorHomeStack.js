import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { DoctorHomeScreen } from '../screens'
import PatientInfo from '../screens/doctor/patientData/PatientInfo'
import DoctorMeetItem from '../screens/doctor/patientData/DoctorMeetItem'
import PatientTests from '../screens/doctor/patientData/PatientTests'
import TestInfo from '../screens/doctor/patientData/TestInfo'

const Stack = createStackNavigator()

export default function DoctorHomeStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={DoctorHomeScreen} />
        <Stack.Screen name='Info' component={PatientInfo} />
        <Stack.Screen name='MeetInfo' component={DoctorMeetItem} />
        <Stack.Screen name='Tests' component={PatientTests} />
        <Stack.Screen name='TestInfo' component={TestInfo} />
      </Stack.Navigator>
    )
}