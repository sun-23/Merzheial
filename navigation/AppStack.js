import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { UserStack } from './UserStack';

// caretaker screen
import CareTakerHomeStack from './CareTakerHomeStack';
import { Blog } from '../screens/caretaker/Blog';

// doctor screen
import DoctorHomeStack from './DoctorHomeStack';
import DoctorMeetStack from './DoctorMeetStack';

// patient screen
import Game from '../screens/patient/game/picture_puzzle/Game';
import { PatientSocialScreen } from '../screens';
import { PatientTest2 } from '../screens/patient/Test2Page/PatientTest2';
import PatientListStack from './PatientListStack';
import PatientStatStack from './PatiantStatStack';
import { FamilyStack } from './PatientFamilyStack';

//pdpa
import PDPA from '../screens/PDPA';

import { userInfoAtom, dayAtom } from '../store';
import { useRecoilState } from 'recoil';
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from '../config';
import { LoadingIndicator, View } from '../components';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export const AppStack = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [curDay, setDay] = useRecoilState(dayAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeUserInfo = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      console.log("user Info data: ", doc.data());
      setUserInfo(doc.data());
      setIsLoading(false);
    },(error) => {
      console.log("error user info", error);
    });

    setDay(() => {
        var d = new Date()
        d.setHours(0)
        d.setMinutes(0)
        d.setSeconds(0)
        return d.getTime()
    })

    var a = curDay
    console.log("curDay ==>", a.toString());

    return () => {
      unsubscribeUserInfo();
    }
  }, [])

  const renderIcons = ({ focused, color, size, route }) => {
    let iconName;

    if (route.name === 'Home') {
      iconName = focused ? 'ios-home' : 'ios-home-outline';
    } else if (route.name === 'Statistic' || route.name === 'appointments') {
      iconName = focused ? 'ios-today' : 'ios-today-outline';
    } else if (route.name === 'Social') {
      iconName = focused ? 'ios-chatbubble-ellipses' : 'ios-chatbubble-ellipses-outline';
    } else if (route.name === 'Family') {
      iconName = focused ? 'ios-people' : 'ios-people-outline';
    } else if (route.name === 'User') {
      iconName = focused ? 'ios-person' : 'ios-person-outline';
    } else if (route.name === 'Game') {
      iconName = focused ? 'game-controller' : 'game-controller-outline';
    } else if (route.name === 'Blog') {
      iconName = focused ? 'newspaper' : 'newspaper-outline';
    }

    // You can return any component that you like here!
    return <Ionicons name={iconName} size={size} color={color} />;
  }

  if (isLoading) {
    return <LoadingIndicator />
  }

  if (!userInfo.allowPDPA) {
    return <PDPA />
  }

  if (userInfo.person_type === 'doctor') {
    return (
      <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            return renderIcons({ focused, color, size, route })
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
      >
        <Tab.Screen name='Home' component={DoctorHomeStack} />
        <Tab.Screen name='appointments' component={DoctorMeetStack}/>
        <Tab.Screen name='User' component={UserStack} />
      </Tab.Navigator>
    );
  } else if (userInfo.person_type === 'caretaker') {
    return (
      <Tab.Navigator
        initialRouteName="Home" 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            return renderIcons({ focused, color, size, route })
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
      >
        <Tab.Screen name='Home' component={CareTakerHomeStack} />
        <Tab.Screen name='Social' component={PatientSocialScreen}/>
        <Tab.Screen name='Blog' component={Blog} />
        <Tab.Screen name='User' component={UserStack} />
      </Tab.Navigator>
    )
  } else if (userInfo.person_type === 'patient' && !userInfo.isTest) {
    return (
      <PatientTest2 firstTest={true}/>
    )
  } else if (userInfo.person_type === 'patient' && userInfo.isTest) {
    return (
      <Tab.Navigator 
        initialRouteName="Home" 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            return renderIcons({ focused, color, size, route })
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
      >
        <Tab.Screen name='Home' component={PatientListStack}/>
        <Tab.Screen name='Social' component={PatientSocialScreen}/>
        <Tab.Screen name='Game' component={Game}/>
        <Tab.Screen name='Statistic' component={PatientStatStack}/>
        <Tab.Screen name='Family' component={FamilyStack}/>
        <Tab.Screen name='User' component={UserStack}/>
      </Tab.Navigator>
    );
  }

  return (
    <View isSafe>
      <Text>Person type invalid!</Text>
    </View>
  )
};
