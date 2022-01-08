import React from 'react'
import { StyleSheet, Text, Image } from 'react-native'
import { Colors } from '../config';
import { Button, View, Logo } from '../components'

import { useRecoilValue } from 'recoil';
import { userInfoAtom } from '../store';
import { auth, Images } from '../config';
import { signOut } from '@firebase/auth';

export const UserScreen = ({ navigation }) => {
    const userInfo = useRecoilValue(userInfoAtom);
    return (
        <View isSafe style={styles.container}>
            <Text style={styles.screenTitle}>ข้อมูลผู้ใช้</Text>
            {/* <Text>{JSON.stringify(userInfo)}</Text> */}
            {userInfo.urlImage ? <Image source={{ uri: userInfo.urlImage }} style={{ width: 200, height: 200, borderRadius: 100, marginVertical: 10 }} /> : <Logo uri={Images.logo} />}
            <Text>{userInfo.firstname} {userInfo.lastname}</Text>
            <Text>{userInfo.email}</Text>
            <Text>อายุ {userInfo.age} ปี</Text>
            <Text>เพศ {userInfo.sex_type == 'female' ? 'หญิง' : 'ชาย'}</Text>

            {/* patient test */}
            {userInfo.person_type === 'patient' ? 
              <Button
                style={styles.borderlessButtonContainer}
                borderless
                title={'ทำแบบทดสอบ moca'}
                onPress={() => navigation.navigate('DoTestMOCA')}
              /> :
            null}
            {userInfo.person_type === 'patient' ? 
              <Button
                style={styles.borderlessButtonContainer}
                borderless
                title={'ทำแบบทดสอบ คำถาม'}
                onPress={() => navigation.navigate('DoSimpleTest')}
              /> :
            null}

            <Button
                style={styles.borderlessButtonContainer}
                borderless
                title={'เปลี่ยนแปลงข้อมูลผู้ใช้'}
                onPress={() => navigation.navigate('UpdateUser')}
            />
            <Button
                style={styles.borderlessButtonContainer}
                onPress={() => {
                    signOut(auth);
                }}
                borderless
                title={"ออกจากระบบ"}
            />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.black,
    paddingTop: 20
  },
  borderlessButtonContainer: {
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 20
  }
});
