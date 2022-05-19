import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, Image, Dimensions, ScrollView, TextInput, Pressable, Alert, RefreshControl } from 'react-native'
import { View, LoadingIndicator } from '../../components'
import { Colors, db, auth } from '../../config';
import { collection, query, startAt, endAt, orderBy, onSnapshot, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { allPatientsAtom } from '../../store';
import { useRecoilState } from 'recoil';
const {width, height} = Dimensions.get('window');

// todo
export const CaretakerHomeScreen = ({navigation}) => {

  // patients of doctor
  const [allPatients, setAllPatients] = useRecoilState(allPatientsAtom);

  const [isLoading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const [searchPatient, setSearchPatient] = useState([]);
  const [search, setSearch] = useState('');

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    // effect
    loadOptions(search)
  }, [search])

  useEffect(() => {
    // effect
    setLoadingPatients(true)
    const patientsRef = collection(db ,"users", auth.currentUser.uid, "all-patients")
    const unsubPatients = onSnapshot(patientsRef, (snapshot) => {
      setAllPatients([]);
      // console.log(snapshot.docs.map((item) => item.data()));
      snapshot.docs.map(async (item) => {
        const patient_uid = item.data().uid
        const patientRef = doc(db ,"users", patient_uid)
        const docsnap = await getDoc(patientRef)
        console.log('docsnap', docsnap.data());
        setAllPatients((prev) => [...prev, {...docsnap.data()}]);
      })
      // console.log('fetch patients', allPatients);
      setLoadingPatients(false)
    });

    return () => {
      // cleanup
      unsubPatients();
    }
  }, [])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadOptions(search);
    refreshUserData()
    setRefreshing(false);
  }, []);

  const refreshUserData = async () => {
    console.log('refesh');
    setLoadingPatients(true)
    setAllPatients([]);
    const patientsRef = collection(db ,"users", auth.currentUser.uid, "all-patients")
    const allpatients = await getDocs(patientsRef);
    allpatients.docs.map(async (item) => {
        const patient_uid = item.data().uid
        const patientRef = doc(db ,"users", patient_uid)
        const docsnap = await getDoc(patientRef)
        // console.log('docsnap', docsnap.data());
        setAllPatients((prev) => [...prev, {...docsnap.data()}]);
      })
    // console.log('refetch patients', allPatients);
    setLoadingPatients(false)
  }

  const loadOptions = async (inputValue) => {
    setLoading(true);
    setSearchPatient([]);
    // console.log('click query');
    const userRef = collection(db, "users");
    const q = query(userRef, orderBy("uid"), startAt(inputValue), endAt(inputValue+"\uf8ff"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.filter(doc => doc.data().person_type == "patient")
    // console.log('found user',users.map((doc) => doc.data()));
    setSearchPatient(users.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }))
    setLoading(false);
  }

  const checkSelectPatientInPatients = (uid) => {
    if (allPatients.length === 0) {
      return true
    }

    const findPatient = allPatients.filter(e => e.uid === uid);
    // console.log("find patient ==>",findPatient);

    if (findPatient.length === 0) {
      return true
    } else {
      return false
    }
  }

  const addPatient  = async (patient) => {
    // check patient that is not added in lists
    console.log('clicked patient ==> ', patient.firstname, '\n        uid ==> ', patient.uid);
    const r = checkSelectPatientInPatients(patient.uid)
    if (r === true) {
      const docRef = doc(db ,"users", auth.currentUser.uid, "all-patients", patient.uid);
      await setDoc(docRef, {uid: patient.uid}, {merge: true}).then(() => {
        alertMessage("success", "The patient has been added");
      })
    } else {
      alertMessage("Can't add patients", "The patient was previously added.");
    }
  }

  const alertMessage = (title, message) => {
    Alert.alert(
      title, 
      message, 
      [
        { text: "OK", onPress: () => {}}
      ]
    );
  }


  const gotoPatientInfo = (patient) => {
    console.log("naviagte to ", patient);
    navigation.navigate("Info", {patientInfo: patient});
  }

  const RenderPatients = () => {
    return allPatients.map(patient => {
      return <Pressable 
                key={patient.uid}
                style={[styles.item, styles.itemPatient]}
                onPress={() => {
                  // navigate to patientInfo
                  gotoPatientInfo(patient)
                }}
              >
                {!patient.urlImage ? 
                  <Image 
                    style={[styles.image, styles.imagePatient]}  
                    source={require('../../assets/avatar.webp')}
                  /> : 
                  <Image 
                    style={[styles.image, styles.imagePatient]} 
                    source={{uri: patient.urlImage}}
                />}
                <View style={styles.itemViewText}>
                  <Text style={styles.itemTitle}>{patient.firstname} {patient.lastname}</Text>
                  <Text style={styles.itemTitle}>age: {patient.age}years sex: {patient.sex_type === "female" ? "female" : "male"}</Text>
                  <Text style={[styles.itemTitle, {fontSize: 14, paddingTop: 3}]}>uid: {patient.uid}</Text>
                </View>
        </Pressable>
    })
    }

  return (
    <View isSafe style={styles.container}>
      <Text style={styles.textHeader}>patient list</Text>
      <View style={styles.viewHeader}>
        <TextInput 
          onChangeText={setSearch} 
          placeholder="Type the uid of the patient." 
          value={search}
          style={styles.titleInput}
        />
        <Pressable 
          style={[styles.buttonSummit, styles.button]}
          onPress={() => {
            loadOptions(search)
          }}
        >
          <Text style={styles.textBtn}>search</Text>
        </Pressable>
      </View>
      {!isLoading ? <View style={styles.scrollView}>
          {searchPatient.length == 0 ? <Text>Can't find patients whose uid starts with {search}</Text>
           : (
             <ScrollView>
              <View style={{height: 4, width: width*0.8, backgroundColor: '#f0f0f0'}}></View>
              {searchPatient.map(patient => {
              return <View 
                        key={patient.uid}
                        style={[styles.item, styles.itemSearch]}
                      >
                        {!patient.urlImage ? 
                          <Image 
                            style={[styles.image, styles.imageSearch]}  
                            source={require('../../assets/avatar.webp')}
                          /> : 
                          <Image 
                            style={[styles.image, styles.imageSearch]} 
                            source={{uri: patient.urlImage}}
                        />}
                        <View style={styles.itemViewText}>
                          <Text style={styles.itemTitle}>{patient.firstname}</Text>
                          <Text style={styles.itemTitle}>{patient.lastname}</Text>
                        </View>
                        {checkSelectPatientInPatients(patient.uid) ?
                          <Pressable 
                            style={[styles.buttonOpen, styles.button]}
                            onPress={() => {
                              addPatient(patient)
                            }}
                          >
                            <Text style={styles.textBtn}>add patient</Text>
                          </Pressable>
                         : 
                          <Pressable 
                            style={[styles.button, {backgroundColor: "#00af00"}]}
                            onPress={() => {
                              // navigate to patientInfo
                              gotoPatientInfo(patient)
                            }}
                          >
                           <Text style={styles.textBtn}>go to info</Text>
                        </Pressable>}
                      </View>
                    }
                  )
                }
                </ScrollView>
              )
          }
      </View>: <View style={styles.scrollView}><LoadingIndicator/></View>}
      <Text>pull to refresh</Text>
      <View style={{height: 5, width: width, backgroundColor: '#1597e5'}}></View>
      {!loadingPatients ? 
      (<ScrollView 
        refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={{height: 4, width: width, backgroundColor: '#f0f0f0'}}></View>
          <RenderPatients/>
        </ScrollView>) : <LoadingIndicator/>}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center', 
      backgroundColor: 'white',
      height: height
      // justifyContent: 'center'
    }, 
    scrollView: {
      width: width*0.8,
      minHeight: 70,
      maxHeight: 200,
      alignItems: 'center',
      justifyContent: "center",
      borderRadius: 5,
      backgroundColor: "#efefef",
      marginVertical: 12,
      // shadow
      shadowRadius: 2.62,
      shadowOpacity: 0.23,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      elevation: 4,
    },
    button: {
      justifyContent: 'center',
      width: 'auto',
      height: 50,
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    buttonOpen: {
      backgroundColor: Colors.orange,
    },
    buttonSummit: {
      backgroundColor: '#1597e5',
    },
    textBtn: {
      alignSelf: 'center', 
      fontWeight: 'bold', 
      color: 'white'
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
      justifyContent: 'space-evenly',
      alignItems: 'center',
      alignSelf: 'center'
    },
    titleInput:{
      height: 50,
      width: width*0.7,
      padding: 10,
      borderRadius: 5,
      fontSize: 20,
      backgroundColor: "#f7f7f7",
    },
    itemSearch:{
      width: width*0.8,
      justifyContent: 'space-evenly',
      alignItems: 'center',
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
    imageSearch: {
      height: 50, 
      width: 50, 
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

