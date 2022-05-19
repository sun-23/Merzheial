import { StyleSheet, Text, Pressable, ScrollView, Dimensions } from 'react-native'
import { View } from '../components'
import React from 'react'
import { db, auth, Colors} from '../config'
import { doc, setDoc } from 'firebase/firestore'

const {width, height} = Dimensions.get('window')

const PDPA = () => {
  return (
    <View isSafe style={styles.container}>
        <Text style={{fontSize: 30, fontWeight: '600'}}>Policy</Text>
        <ScrollView style={{paddingHorizontal: width*0.05}}>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                1. Introduction Welcome to the application, we have made this privacy notice to inform you of the privacy policy, details of data collection, use or disclosure in accordance with the Personal Data Protection Act 2019 “PDPA. ” (Personal Data Protection Act) because we are very aware of the importance of customer data, customers can be confident that the information provided to us has the appropriate security measures and the best security.
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16}]}>
                2. When is personal information collected? "Personal Information" means information about an individual which enables an identifiable individual, directly or indirectly, for which we collect Personal Data if necessary and use it only.
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                2.1 When applying for membership 2.2 When filling out Statistic
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                3. What personal information is collected? The types of personal data to be collected are used to the extent of the service by collecting information as necessary and useful under the law, personally identifiable information such as first name, last name, etc., contact information such as e-mail, telephone numbers, postal addresses. Transactional information, purchase and payment details, etc., technical information such as IP address, Cookie, Web Browser, etc.
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                4. How do I protect my personal information? We have strict security measures in place to support the highest level of information security, electronic security certificates based on SSL (Security Socket Layer) standards approved for websites by CA (Certificate Authority) are encrypted to protect information such as personal information, passwords, credit card numbers, etc.
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                5. Disclosure of personal information to third parties In the course of our business, it is necessary for us to disclose personal information to third parties such as for medical purposes. We assure you that the personal information we have collected will not be shared or sold to them. with unrelated third parties is strictly prohibited except in the event of legal implications.
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                6. Period of retention of personal data We will retain your personal data only to the extent required by law or as necessary for the purposes for which it was collected. We will delete or destroy personal data when it is determined that retention is not necessary at the point. stated wishes.
            </Text>
            <Text style={[styles.textStyle, {fontSize: 16, marginBottom:10}]}>
                7. Policy amendments Protection of Personal Information We will consider updating the Privacy Policy from time to time to reflect changes in the provision of services, operating under the law. We will disclose the Policy. Let customers know clearly through the application as appropriate when visiting the application or receiving services from us. Please read this privacy policy every time for the customer's own benefit.
            </Text>
        </ScrollView>
        <Pressable onPress={() => {
            const userRef = doc(db, "users", auth.currentUser.uid)
            setDoc(userRef,{
            allowPDPA: true
            }, {merge: true})
        }} style={[styles.btn, {alignSelf: 'center', marginBottom: 40}]}>
            <Text style={[styles.textStyle, {color: "white"}]}>accept</Text>
        </Pressable>
    </View>
  )
}

export default PDPA

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        width: width*0.9,
        height: 50,
        borderRadius: 5,
        backgroundColor: Colors.orange,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12
    },
    textStyle: {
        fontWeight: "bold",
        fontSize: 20,
    },
})