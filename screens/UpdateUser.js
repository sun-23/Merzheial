import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Alert, Platform, Image, Pressable, Dimensions } from 'react-native';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, TextInput, Logo, FormErrorMessage, Button } from '../components';
import { DropdownList } from 'react-native-ultimate-modal-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { updateUserSchema } from '../utils';
import { doc, setDoc } from "firebase/firestore"; 
import { Images, Colors, auth, db, storage } from '../config';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRecoilValue } from 'recoil';
import { userInfoAtom } from '../store';

const {width} = Dimensions.get('window');

export const UpdateUser = ({ navigation }) => {

  const userInfo = useRecoilValue(userInfoAtom)

  const [errorState, setErrorState] = useState('');
  const [image, setImage] = useState(null);
  const [btnEnable, setBtnEnable] = useState(true);
  const [uploadProgess, setUpLoadProgess] = useState(0);
  const [allergy, setAllergy] = useState('');
  const [address, setAddress] = useState('');
  const [like, setLike] = useState('');
  const [unlike, setUnlike] = useState('');

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            "การเข้าถึงรูปภาพ",
            "Sorry, we need camera roll permissions to make pick the photo",
          [
              { text: "OK", onPress: () => console.log("OK Pressed") }
          ])
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    // console.log(result);
    if (!result.cancelled) {
      let { width, height } = result;
      const manipResult = await manipulateAsync(
          result.uri,
          [{ resize: { width: 480, height: (height/width*480) } }],
          { format: SaveFormat.JPEG, compress: 1 }
      );
      console.log(manipResult);
      setImage(manipResult.uri);
    }
  };

  const uploadImageAsync = async (uri, callBack) => {
    if (uri) {
      console.log('image ok', uri);
      const imageRef = ref(storage, 'images-user/'+ auth.currentUser.uid);
      await fetch(uri)
      .then(response => response.blob())
      .then(blob => {
        const uploadTask = uploadBytesResumable(imageRef, blob);
        uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setUpLoadProgess(progress.toFixed(2));
        },
        (error) => {
          setErrorState(error.message);
        },  
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            callBack(downloadURL);
          });
        })
      });
    } else {
      callBack('');
    }
  }

  const updateUser = async values => {
    setBtnEnable(false);
    const { age, sex_type, name, lastname } = values;
    const docRef = doc(db, "users", auth.currentUser.uid)
    console.log('click updateUser');
    await uploadImageAsync(image, async (result) => {
      if (result === '') {
        const imageRef = ref(storage, 'images-user/'+ auth.currentUser.uid);
        // user did not pick image but have allready upload image before
        getDownloadURL(imageRef).then(async (downloadURL) => {
          console.log('File available at', downloadURL);
          await setDoc(docRef, {urlImage: downloadURL}, { merge: true })
        })
      } else {
        await setDoc(docRef, {urlImage: result}, { merge: true })
      }
      const payload = {
        firstname: name,
        lastname: lastname,
        age: age,
        sex_type: sex_type,
      };
      console.log(payload);

      if (userInfo.person_type === 'patient') {
        const payload = {
          allergy: (allergy != '') ? allergy : userInfo.allergy,
          address: (address != '') ? address : userInfo.address,
          like: (like != '') ? like : userInfo.like,
          unlike: (unlike != '') ? unlike : userInfo.unlike,
        };
        await setDoc(docRef, payload, { merge: true })
      }

      // bug
      // fix https://github.com/firebase/firebase-js-sdk/issues/5667#issuecomment-952079600
      // fix bug with const db = initializeFirestore(firebaseApp, {useFetchStreams: false})
      await setDoc(docRef, payload, { merge: true }).then(() => {
        setBtnEnable(true);
        Alert.alert(
        "เปลี่ยนแปลงข้อมูล",
        "เปลี่ยนแปลงข้อมูลผู้ใช้สำเร็จ",
        [
            { text: "OK", onPress: () => {
              console.log("OK Pressed");
              navigation.goBack();
            }}
        ])
        console.log('create user success');
      }).catch(error => setErrorState(error.message));
    });
  };

  return (
    <View isSafe style={styles.container}>
      <View style={styles.viewHeader}>
        <Pressable onPress={() => navigation.goBack()} disabled={!btnEnable}>
          <Ionicons name={'arrow-back-circle'} size={30} color={Colors.blue} />
        </Pressable>
        <Text style={styles.textHeader}>update user information</Text>        
      </View>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        {/* LogoContainer: consits app logo and screen title */}
        <View style={styles.logoContainer}>
          {image ? <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 100 }} /> : <Logo uri={Images.logo} />}
          <Text style={styles.screenTitle}>change user information</Text>
          <Button style={styles.button} onPress={pickImage} disabled={!btnEnable}>
            <Text style={styles.buttonText}>select profile picture</Text>
          </Button>
          {!btnEnable ? <Text style={{paddingVertical: 16}}>Image uploaded {uploadProgess} %</Text> : null}
        </View>
        {/* Formik Wrapper */}
        <Formik
          initialValues={{
            age: '',
            sex_type: '',
            name: '',
            lastname: ''
          }}
          validationSchema={updateUserSchema}
          onSubmit={values => updateUser(values)}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur,
            isSubmitting,
          }) => (
            <>
              {/* name */}
              <TextInput
                name='name_lastname'
                placeholder='Please enter your first name'
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
                placeholder='Please enter your last name'
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
              {/* age */}
              <TextInput
                name='age'
                placeholder='enter your age'
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

              {/* patient */}
              {userInfo.person_type === 'patient' ?
                <>
                <TextInput
                  name='allergy'
                  placeholder='Please specify what you are allergic to.'
                  autoCapitalize='none'
                  autoFocus={true}
                  value={allergy}
                  onChangeText={setAllergy}
                />
                <TextInput
                  name='like'
                  placeholder='Please specify what you like.'
                  autoCapitalize='none'
                  autoFocus={true}
                  value={like}
                  onChangeText={setLike}
                />
                <TextInput
                  name='not like'
                  placeholder='Please specify what you do not like.'
                  autoCapitalize='none'
                  autoFocus={true}
                  value={unlike}
                  onChangeText={setUnlike}
                />
                <TextInput
                  name='address'
                  placeholder='Please specify address'
                  autoCapitalize='none'
                  autoFocus={true}
                  value={address}
                  onChangeText={setAddress}
                />
                </> 
              : null}


              {/* picker sex type */}
              <DropdownList
                title="select gender"
                items={[
                  { label: 'female', value: 'female' },
                  { label: 'male', value: 'male' },
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
              {/* Update button */}
              <Button style={styles.button} onPress={handleSubmit} disabled={(!isSubmitting == btnEnable) ? false : true}>
                <Text style={styles.buttonText}>submit</Text>
              </Button>
            </>
          )}
        </Formik>
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
});