import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFMzkb0UeYAyF7B0BXHphdfdjmdVinZAs",
  authDomain: "safetyapp-5c0f0.firebaseapp.com",
  databaseURL: "https://safetyapp-5c0f0-default-rtdb.firebaseio.com",
  projectId: "safetyapp-5c0f0",
  storageBucket: "safetyapp-5c0f0.appspot.com",
  messagingSenderId: "1097450382217",
  appId: "1:1097450382217:web:76bb16bdbbb17aca16b758",
  measurementId: "G-05VE8KKSNW",
};
const app = initializeApp(firebaseConfig);
// const fStore = getFirestore(app);
const auth = getAuth(app);
export default auth;
// export { fStore };
