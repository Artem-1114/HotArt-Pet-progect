import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAh37aEMmv6-na7_pu5E85Q4e7sFWGDh-A",
    authDomain: "my-project-hotart.firebaseapp.com",
    projectId: "my-project-hotart",
    storageBucket: "my-project-hotart.appspot.com",
    messagingSenderId: "442141775825",
    appId: "1:442141775825:web:538fd0a59ccbba6dc732f0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);