import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import ItemList from '../screens/patient/PatientListPage/ItemList'
import PatientList from '../screens/patient/PatientListPage/PatientList'
import CreateList from '../screens/patient/PatientListPage/CreateList'

const Stack = createStackNavigator()

export default function PatientListStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='List' component={PatientList} />
        <Stack.Screen name='Item' component={ItemList} />
        <Stack.Screen name='Create_new' component={CreateList} />
      </Stack.Navigator>
    )
}
