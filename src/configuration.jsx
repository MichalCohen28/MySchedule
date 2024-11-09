// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFZjV0RaDr_zKylc8Z69SkIYKw7OZyKWM",
  authDomain: "ourschedule-f8982.firebaseapp.com",
  databaseURL: "https://ourschedule-f8982-default-rtdb.firebaseio.com",
  projectId: "ourschedule-f8982",
  storageBucket: "ourschedule-f8982.firebasestorage.app",
  messagingSenderId: "271715112071",
  appId: "1:271715112071:web:59c4d3c0b7c1aa5f141422"
};
// Initialize Firebase
const cong = initializeApp(firebaseConfig);

export default cong;
// Now you can use Firebase services in your React app!