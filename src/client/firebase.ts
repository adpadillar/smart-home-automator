import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAIjeGzGE6ePOLeP0I1ShdvmP8tFI2d6u0",
  authDomain: "ejemplouso-9c70d.firebaseapp.com",
  databaseURL: "https://ejemplouso-9c70d-default-rtdb.firebaseio.com",
  projectId: "ejemplouso-9c70d",
  storageBucket: "ejemplouso-9c70d.appspot.com",
  messagingSenderId: "916067871618",
  appId: "1:916067871618:web:9719e5573be1878d4a7d9b",
  measurementId: "G-1CV5PH7EE3",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
