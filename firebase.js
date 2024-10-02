// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcslPB3Y9HWysuJZTwSygj1uOPMX8OZ6k",
  authDomain: "crophealer-d57a5.firebaseapp.com",
  projectId: "crophealer-d57a5",
  storageBucket: "crophealer-d57a5.appspot.com",
  messagingSenderId: "161984045182",
  appId: "1:161984045182:web:8e9840a2b57a3b91e7b82f",
 // measurementId: "G-JX5BJRWKH0"
};


// Initialize Firebase
let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const auth = firebase.getAuth(app);

//const analytics = getAnalytics(app);

export { auth };