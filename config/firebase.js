import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from '@firebase/storage';
import Constants from 'expo-constants'; 


// add firebase config
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId
};

// initialize firebase
const firebaseApp = initializeApp(firebaseConfig);

// initialize auth
const auth = getAuth();

// bug with react-native work only react
// const db = getFirestore();

// fix https://github.com/firebase/firebase-js-sdk/issues/5667#issuecomment-952079600
const db = initializeFirestore(firebaseApp, {useFetchStreams: false})

const storage = getStorage(firebaseApp);

export { auth, db, storage };
