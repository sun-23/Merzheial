import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { DoctorMeets } from '../screens/doctor/allmeet/DoctorMeets'
import DoctorMeetItem from '../screens/doctor/patientData/DoctorMeetItem'

const Stack = createStackNavigator()

export default function DoctorMeetStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Stat' component={DoctorMeets} />
        <Stack.Screen name='MeetDocDesc' component={DoctorMeetItem} />
      </Stack.Navigator>
    )
}