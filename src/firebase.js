// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAd1UJrE9LFvNOI6jp9am1eyHQLDL5Ll8Q",
  authDomain: "studyling-6fada.firebaseapp.com",
  projectId: "studyling-6fada",
  storageBucket: "studyling-6fada.firebasestorage.app",
  messagingSenderId: "426130916056",
  appId: "1:426130916056:web:76862156edde2100adcdad",
  measurementId: "G-Z2XMCEZZFY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);