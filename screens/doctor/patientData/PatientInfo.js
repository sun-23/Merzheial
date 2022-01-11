import React from 'react'
import { StyleSheet, Text, Image, Dimensions, ScrollView } from 'react-native'
import { View, Button } from '../../../components'
import { Colors } from '../../../config';
const {width, height} = Dimensions.get('window');

const PatientInfo = ({navigation, route}) => {
    const { patientInfo } = route.params; 
    return (
        <ScrollView>
            <View isSafe style={styles.container}>
                <View style={styles.viewHeader}>
                    <Button 
                        title='กลับ'
                        borderless
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={styles.textHeader}>คนไข้</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Button
                            style={{paddingLeft: 5}} 
                            title='ผลแบบทดสอบ'
                            borderless
                            onPress={() => navigation.goBack()}
                        />
                        <Button 
                            style={{paddingHorizontal: 5}} 
                            title='สร้างนัด'
                            borderless
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={[styles.item, styles.itemPatient]}>
                        {!patientInfo.urlImage ? 
                            <Image 
                                style={[styles.image, styles.imagePatient]}  
                                source={require('../../../assets/avatar.webp')}
                            /> : 
                            <Image 
                                style={[styles.image, styles.imagePatient]} 
                                source={{uri: patientInfo.urlImage}}
                        />}
                        <View style={styles.itemViewText}>
                            <Text style={styles.itemTitle}>ชื่อ: {patientInfo.firstname}</Text>
                            <Text style={styles.itemTitle}>นามสกุล: {patientInfo.lastname}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>สิ่งที่ชอบ {patientInfo.like}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>สิ่งที่ไม่ชอบ {patientInfo.unlike}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>สิ่งที่แพ้ {patientInfo.allergy}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>ที่อยู่ {patientInfo.address}</Text>
                            <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>uid: {patientInfo.uid}</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.textStyle}>รายการนัดหมาย</Text>
            </View>
        </ScrollView>
    )
}

export default PatientInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        backgroundColor: 'white',
        height: height
        // justifyContent: 'center'
    }, 
    content: {
        width: width*0.8,
        alignItems: 'center'
    },
    button: {
        justifyContent: 'center',
        width: width*0.9,
        height: 50,
        borderRadius: 5,
        marginVertical: 10
    },
    buttonOpen: {
        backgroundColor: Colors.orange,
    },
    buttonSummit: {
        backgroundColor: '#1597e5',
    },
    textStyle: {
        fontWeight: "bold",
        fontSize: 20,
    },
    textHeader: {
        fontWeight: 'bold', 
        fontSize: 30,
        marginLeft: 20,
        marginBottom: 10
    },
    viewHeader: {
        width: width*0.9,
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center'
    },
    itemPatient:{
      width: width,
    },
    item:{
      height: 'auto',
      paddingHorizontal: width * 0.05,
      borderBottomWidth: 4,
      borderColor: '#f0f0f0',
      paddingBottom: 5,
      flexDirection: 'row',
    },
    imagePatient: {
      height: 70, 
      width: 70, 
    },
    image: { 
      borderRadius: 5,
      marginVertical: 12,
      alignSelf: 'flex-start'
    },
    itemTitle:{
      fontSize: 20,
      fontWeight: '600',
    },
    itemViewText: {
      alignSelf: 'center', 
      paddingLeft: 10
    },
})