import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import PatientMeetItem from '../screens/patient/PatientMeetItem'
import { PatientStatScreen } from '../screens'

const Stack = createStackNavigator()

export default function PatientStatStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Stat' component={PatientStatScreen} />
        <Stack.Screen name='MeetDocDesc' component={PatientMeetItem} />
      </Stack.Navigator>
    )
}