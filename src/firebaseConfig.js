import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQu6mgVPLNwUPjYUZhC68TYOZo8NcrEvw",
    authDomain: "nevins-fitness-forge-b311f.firebaseapp.com",
    databaseURL: "https://nevins-fitness-forge-b311f-default-rtdb.firebaseio.com",
    projectId: "nevins-fitness-forge-b311f",
    storageBucket: "nevins-fitness-forge-b311f.appspot.com",
    messagingSenderId: "9253807159",
    appId: "1:9253807159:web:e7cc405cc348da1e2a4bb2",
    measurementId: "G-REH2J0MZ8W"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
