import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAl9EoFqhuRMwZTa7Qx1HLzUw3hU87Lht4",
  authDomain: "pamoja-aa41b.firebaseapp.com",
  databaseURL: "https://pamoja-aa41b-default-rtdb.firebaseio.com",
  projectId: "pamoja-aa41b",
  storageBucket: "pamoja-aa41b.appspot.com",
  messagingSenderId: "861923758020",
  appId: "1:861923758020:web:68438cac3c69c03aea1e91",
  measurementId: "G-EFCEPEMWTX",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { auth, db, storage };
// export { fStore };
