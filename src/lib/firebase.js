import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVX2GEBknV9fsO6cOXgVcy3aJfXM2bmyE",
  authDomain: "auth-omelet.firebaseapp.com",
  projectId: "auth-omelet",
  storageBucket: "auth-omelet.appspot.com",
  messagingSenderId: "1031123167170",
  appId: "1:1031123167170:web:9455a5bf1539fc97c1585b",
  measurementId: "G-MJ0EHCQYYX",
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storageF = getStorage(app);
