import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PatientFamily from '../screens/patient/PatientFamily';
import PatientNewFP from '../screens/patient/PatientNewFP';

const Stack = createStackNavigator();

export const FamilyStack = () => {
  return (
    <> 
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Family-lists' component={PatientFamily} />
            <Stack.Screen name='New-person' component={PatientNewFP} />
        </Stack.Navigator>
    </>
  );
};