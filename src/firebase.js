// import firebase from "firebase";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDArZyAb1GTF5l9AOOa98vwsalE2ptB4eA",
  authDomain: "kvndemo-4d681.firebaseapp.com",
  databaseURL: "https://kvndemo-4d681-default-rtdb.firebaseio.com",
  projectId: "kvndemo-4d681",
  storageBucket: "kvndemo-4d681.appspot.com",
  messagingSenderId: "565509094873",
  appId: "1:565509094873:web:09f2e1ebd7f6d9b1dfadc8",
  measurementId: "G-4PYH8YFMQM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
var database = getDatabase(app);

export { app, auth, db, database, collection, getDocs };
