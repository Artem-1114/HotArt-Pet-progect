// Імпорт необхідних функцій з Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Конфігурація Firebase вашого веб-додатку
const firebaseConfig = {
    apiKey: "AIzaSyAh37aEMmv6-na7_pu5E85Q4e7sFWGDh-A",
    authDomain: "my-project-hotart.firebaseapp.com",
    projectId: "my-project-hotart",
    storageBucket: "my-project-hotart.firebasestorage.app",
    messagingSenderId: "442141775825",
    appId: "1:442141775825:web:538fd0a59ccbba6dc732f0"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Отримуємо auth для експорту
export const auth = getAuth(app);