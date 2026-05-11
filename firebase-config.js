import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBF1JdikwKg7qVsvJo1QcJDWQga2uHKHEE",
  authDomain: "habitup-63c2f.firebaseapp.com",
  projectId: "habitup-63c2f",
  storageBucket: "habitup-63c2f.firebasestorage.app",
  messagingSenderId: "179611042542",
  appId: "1:179611042542:web:7dcc5325f19c2fd331e9ff",
  measurementId: "G-0KVL2V60CS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// On exporte les outils dont on a besoin pour le site
export const db = getFirestore(app);
export const auth = getAuth(app);
