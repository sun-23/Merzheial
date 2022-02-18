import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { CaretakerHomeScreen } from '../screens'
import CTakerPatientInfo from '../screens/caretaker/patientData/CTakerPatientInfo'
import CTakerMeetItem from '../screens/caretaker/patientData/CTakerMeetItem'
import PatientTests from '../screens/doctor/patientData/PatientTests'
import TestInfo from '../screens/doctor/patientData/TestInfo'
import CTakerPatientList from '../screens/caretaker/patientData/CTakerPatientList'
import CTakerItemList from '../screens/caretaker/patientData/CTakerItemList'
import PatientChatScreen from '../screens/doctor/patientData/PatientChat'
import CTakerCreateList from '../screens/caretaker/patientData/CTakerCreateList'

const Stack = createStackNavigator()

export default function CareTakerHomeStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={CaretakerHomeScreen} />
        <Stack.Screen name='Info' component={CTakerPatientInfo} />
        <Stack.Screen name='MeetInfo' component={CTakerMeetItem} />

        {/* code same as doctor */}
        <Stack.Screen name='Tests' component={PatientTests} />
        <Stack.Screen name='TestInfo' component={TestInfo} />
        <Stack.Screen name='Chat' component={PatientChatScreen}/>

        {/* patient list
          todo
          1. add ctaker create patient list item
         */}
        <Stack.Screen name='List' component={CTakerPatientList} />
        <Stack.Screen name='Item' component={CTakerItemList} />
        <Stack.Screen name='Create_new' component={CTakerCreateList}/>
      </Stack.Navigator>
    )
}