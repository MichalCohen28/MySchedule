
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyAFZjV0RaDr_zKylc8Z69SkIYKw7OZyKWM",
  authDomain: "ourschedule-f8982.firebaseapp.com",
  databaseURL: "https://ourschedule-f8982-default-rtdb.firebaseio.com",
  projectId: "ourschedule-f8982",
  storageBucket: "ourschedule-f8982.firebasestorage.app",
  messagingSenderId: "271715112071",
  appId: "1:271715112071:web:59c4d3c0b7c1aa5f141422"
};
  
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);