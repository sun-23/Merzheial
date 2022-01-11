import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { DoctorHomeScreen } from '../screens'
import PatientInfo from '../screens/doctor/patientData/PatientInfo'
import DoctorMeetItem from '../screens/doctor/patientData/DoctorMeetItem'

const Stack = createStackNavigator()

export default function DoctorHomeStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={DoctorHomeScreen} />
        <Stack.Screen name='Info' component={PatientInfo} />
        <Stack.Screen name='MeetInfo' component={DoctorMeetItem} />
        {/* todo
            D 1. patient info screen
                1.1 patient test info 
                1.2 patient todo(lists) stat(done not done)
            D 2. create meet 
            D 3. all meet with patient
         */}
        {/* <Stack.Screen name='PatientInfo' component={} /> */}
      </Stack.Navigator>
    )
}