import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { DoctorHomeScreen } from '../screens'

const Stack = createStackNavigator()

export default function DoctorHomeStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={DoctorHomeScreen} />
        {/* <Stack.Screen name='PatientInfo' component={} /> */}
      </Stack.Navigator>
    )
}