import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { DoctorHomeScreen } from '../screens'
import PatientInfo from '../screens/doctor/patientData/PatientInfo'
import DoctorMeetItem from '../screens/doctor/patientData/DoctorMeetItem'
import PatientTests from '../screens/doctor/patientData/PatientTests'
import TestInfo from '../screens/doctor/patientData/TestInfo'
import CTakerPatientList from '../screens/caretaker/patientData/CTakerPatientList'
import CTakerItemList from '../screens/caretaker/patientData/CTakerItemList'
import PatientChatScreen from '../screens/doctor/patientData/PatientChat'

const Stack = createStackNavigator()

export default function DoctorHomeStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={DoctorHomeScreen} />
        <Stack.Screen name='Info' component={PatientInfo} />
        <Stack.Screen name='MeetInfo' component={DoctorMeetItem} />
        <Stack.Screen name='Tests' component={PatientTests} />
        <Stack.Screen name='TestInfo' component={TestInfo} />
        <Stack.Screen name='Chat' component={PatientChatScreen}/>

        {/* patient list
          todo
          1. split code and add stat graph
         */}
        <Stack.Screen name='List' component={CTakerPatientList} />
        <Stack.Screen name='Item' component={CTakerItemList} />
      </Stack.Navigator>
    )
}