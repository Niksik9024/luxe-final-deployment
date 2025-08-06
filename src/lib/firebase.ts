
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For a robust client-side setup, these values are hardcoded.
// This is a standard and secure practice for public client credentials.
const firebaseConfig = {
  apiKey: "AIzaSyAHMWZSIOtTWtZ0UENJoOmkankEVop1s1I",
  authDomain: "luxe-cqmea.firebaseapp.com",
  projectId: "luxe-cqmea",
  storageBucket: "luxe-cqmea.firebasestorage.app",
  messagingSenderId: "564643255112",
  appId: "1:564643255112:web:6b4471069350181d94197d"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
