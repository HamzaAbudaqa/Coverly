// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "coverly-884ca.firebaseapp.com",
  projectId: "coverly-884ca",
  storageBucket: "coverly-884ca.appspot.com",
  messagingSenderId: "400810257269",
  appId: "1:400810257269:web:4e10d071d573f4602a413c",
  measurementId: "G-FQ94YGCH8F"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
