import React from 'react'
import { StyleSheet, Text, Image, ScrollView, Dimensions } from 'react-native'
import { Colors } from '../config';
import { Button, View, Logo } from '../components'

import { useRecoilValue } from 'recoil';
import { userInfoAtom } from '../store';
import { auth, Images } from '../config';
import { signOut } from '@firebase/auth';

const {width, height} = Dimensions.get('window');

export const UserScreen = ({ navigation }) => {
    const userInfo = useRecoilValue(userInfoAtom);
    return (
      <ScrollView>
        <View isSafe style={styles.container}>
            <Text style={styles.screenTitle}>ข้อมูลผู้ใช้</Text>
            {/* <Text>{JSON.stringify(userInfo)}</Text> */}
            {userInfo.urlImage ? <Image source={{ uri: userInfo.urlImage }} style={{ width: 200, height: 200, borderRadius: 100, marginVertical: 10 }} /> : <Logo uri={Images.logo} />}
            <Text style={styles.text}>{userInfo.firstname} {userInfo.lastname}</Text>
            <Text style={styles.text}>{userInfo.email}</Text>
            <Text style={styles.text}>อายุ {userInfo.age} ปี</Text>
            <Text style={styles.text}>เพศ {userInfo.sex_type == 'female' ? 'หญิง' : 'ชาย'}</Text>

            {/* patient */}
            {userInfo.person_type === 'patient' ? 
              <>
                <Text style={[styles.text, {color: (userInfo.address !== "") ? "black" : "red"}]}>ที่อยู่: {userInfo.address !== "" ? userInfo.address : "กรุณาระบุ"}</Text>
                <Text style={[styles.text, {color: (userInfo.like !== "") ? "black" : "red"}]}>สิ่งที่ชอบ: {userInfo.like !== "" ? userInfo.like : "กรุณาระบุ"}</Text>
                <Text style={[styles.text, {color: (userInfo.unlike !== "") ? "black" : "red"}]}>สิ่งที่ไม่ชอบ: {userInfo.unlike !== "" ? userInfo.unlike : "กรุณาระบุ"}</Text>
                <Text style={[styles.text, {color: (userInfo.allergy !== "") ? "black" : "red"}]}>สิ่งที่แพ้: {userInfo.allergy !== "" ? userInfo.allergy : "กรุณาระบุ"}</Text>
                <Text style={[styles.text, {color: (userInfo.alzheimer_lv !== "") ? "black" : "red"}]}>ระยะอาการ: {userInfo.alzheimer_lv !== "" ? userInfo.alzheimer_lv : "ให้แพทย์ประเมิณ"}</Text>
              </> :
            null}

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
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    alignItems: 'center',
    minHeight: height
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
    fontSize: 20,
  }
});
