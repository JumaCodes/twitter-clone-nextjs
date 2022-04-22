// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpQ-oLDar8yF13GbuJeQqBgDnBUE1Xi8M",
  authDomain: "next-js-twitter-clone-f54d9.firebaseapp.com",
  projectId: "next-js-twitter-clone-f54d9",
  storageBucket: "next-js-twitter-clone-f54d9.appspot.com",
  messagingSenderId: "778973943668",
  appId: "1:778973943668:web:1c56c2fe79a511082f7e21",
  measurementId: "G-PJBVT1T5TB"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };