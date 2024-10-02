// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAcslPB3Y9HWysuJZTwSygj1uOPMX8Z6k",
    authDomain: "crophealer-d57a5.firebaseapp.com",
    projectId: "crophealer-d57a5",
    storageBucket: "crophealer-d57a5.appspot.com",
    messagingSenderId: "161984045182",
    appId: "1:161984045182:web:8e9840a2b57a3b91e7b82f",
    measurementId: "G-JX5BJRWKH0"
  };

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);