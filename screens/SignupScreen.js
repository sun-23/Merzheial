import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, TextInput, Logo, Button, FormErrorMessage } from '../components';
import { DropdownList } from 'react-native-ultimate-modal-picker';

import { useTogglePasswordVisibility } from '../hooks';
import { signupValidationSchema } from '../utils';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Images, Colors, auth, db } from '../config';
import { doc, setDoc } from "firebase/firestore"; 

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility
  } = useTogglePasswordVisibility();

  const handleSignup = async values => {
    const { email, password, person_type, age, sex_type, name, lastname } = values;
    await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      const docRef = doc(db, "users", auth.currentUser.uid)
      const payload = {
        firstname: name,
        lastname: lastname,
        age: age,
        sex_type: sex_type,
        person_type: person_type,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
        urlImage: '',
        allowPDPA: false
      };
      console.log(payload);
      console.log('click');

      //custom
      if (person_type == 'patient') {
        // add test point
        await setDoc(docRef, { 
          isTest: false, 
          allergy: "", 
          address: "", 
          like: "", 
          unlike: "", 
          alzheimer_lv: "", 
          medicine: "",
          alzheimer_stat_status: 'none' // none, stage1, stage2, stage3
        }, { merge: true }).then(() => {
          console.log('add patient test point');
        }).catch(error => setErrorState(error.message));
      }
      
      // bug
      // fix https://github.com/firebase/firebase-js-sdk/issues/5667#issuecomment-952079600
      // fix bug with const db = initializeFirestore(firebaseApp, {useFetchStreams: false})
      await setDoc(docRef, payload, { merge: true }).then(() => {
        console.log('create user success');
      }).catch(error => setErrorState(error.message));

    }).catch(error =>{
      console.log('create user error', error.message);
      setErrorState(error.message);
    });
  };

  return (
    <View isSafe style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        {/* LogoContainer: consits app logo and screen title */}
        <View style={styles.logoContainer}>
          <Logo uri={Images.logo} />
          <Text style={styles.screenTitle}>สร้างบัญชีผู้ใช้ใหม่</Text>
        </View>
        {/* Formik Wrapper */}
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            person_type: '',
            age: '',
            sex_type: '',
            name: '',
            lastname: ''
          }}
          validationSchema={signupValidationSchema}
          onSubmit={values => handleSignup(values)}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur
          }) => (
            <>
              <TextInput
                name='email'
                leftIconName='email'
                placeholder='Enter email'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoFocus={true}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />
              <TextInput
                name='password'
                leftIconName='key-variant'
                placeholder='Enter password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType='newPassword'
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              <FormErrorMessage
                error={errors.password}
                visible={touched.password}
              />
              <TextInput
                name='confirmPassword'
                leftIconName='key-variant'
                placeholder='Enter password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType='password'
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
              />
              <FormErrorMessage
                error={errors.confirmPassword}
                visible={touched.confirmPassword}
              />
              <TextInput
                name='name_lastname'
                placeholder='กรุณาระบุชื่อ'
                autoCapitalize='none'
                autoFocus={true}
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              <FormErrorMessage
                error={errors.name}
                visible={touched.name}
              />
              <TextInput
                name='lastname'
                placeholder='กรุณาระบุนามสกุล'
                autoCapitalize='none'
                autoFocus={true}
                value={values.lastname}
                onChangeText={handleChange('lastname')}
                onBlur={handleBlur('lastname')}
              />
              <FormErrorMessage
                error={errors.lastname}
                visible={touched.lastname}
              />
              <TextInput
                name='age'
                placeholder='ใส่อายุของคุณ'
                autoCapitalize='none'
                autoFocus={true}
                value={values.age}
                onChangeText={handleChange('age')}
                onBlur={handleBlur('age')}
              />
              <FormErrorMessage
                error={errors.age}
                visible={touched.age}
              />
              <DropdownList
                items={[
                  { label: 'แพทย์', value: 'doctor' },
                  { label: 'ผุ้ป่วย', value: 'patient' },
                  { label: 'ผุ้ดูแล', value: 'caretaker' },
                ]}
                title="เลือกหน้าที่"
                onChange={handleChange('person_type')}
              />
              <FormErrorMessage
                error={errors.person_type}
                visible={touched.person_type}
              />
              <DropdownList
                title="เลือกเพศ"
                items={[
                  { label: 'หญิง', value: 'female' },
                  { label: 'ชาย', value: 'male' },
                ]}
                onChange={handleChange('sex_type')}
              />
              <FormErrorMessage
                error={errors.sex_type}
                visible={touched.sex_type}
              />
              {/* Display Screen Error Mesages */}
              {errorState !== '' ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}
              
              {/* Signup button */}
              <Button style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>สร้างบัญชีผู้ใช้</Text>
              </Button>
            </>
          )}
        </Formik>
        {/* Button to navigate to Login screen */}
        <Button
          style={styles.borderlessButtonContainer}
          borderless
          title={'เป็นสมาชิกแล้ว'}
          onPress={() => navigation.navigate('Login')}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12
  },
  logoContainer: {
    alignItems: 'center'
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.black,
    paddingTop: 20
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700'
  },
  borderlessButtonContainer: {
    marginTop: 16,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
