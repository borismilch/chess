import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'  

const firebaseConfig = {
  apiKey: "AIzaSyAnlm94S3vtP0mYgSXMCMCZLRgTd8wpwZY",
  authDomain: "ssehc-2dd2d.firebaseapp.com",
  projectId: "ssehc-2dd2d",
  storageBucket: "ssehc-2dd2d.appspot.com",
  messagingSenderId: "196069267654",
  appId: "1:196069267654:web:bbda35b3eb492c31359fc7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const firestore = getFirestore()