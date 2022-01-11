import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { DoctorHomeScreen } from '../screens'

const Stack = createStackNavigator()

export default function DoctorHomeStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={DoctorHomeScreen} />
        {/* todo
            1. patient info screen
                1.1 patient test info
                1.2 patient todo(lists) stat(done not done)
            2. create meet
            3. all meet with patient
         */}
        {/* <Stack.Screen name='PatientInfo' component={} /> */}
      </Stack.Navigator>
    )
}