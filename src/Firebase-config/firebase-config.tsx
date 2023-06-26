import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyC503lTcRhUU7qLi5pGd_lO3O5-aN-8JVA",
  authDomain: "qlxh-dd8fb.firebaseapp.com",
  databaseURL: "https://qlxh-dd8fb-default-rtdb.firebaseio.com",
  projectId: "qlxh-dd8fb",
  storageBucket: "qlxh-dd8fb.appspot.com",
  messagingSenderId: "734922534606",
  appId: "1:734922534606:web:5c0e9f79ae90fc8b75ea9f",
  measurementId: "G-TS8LXVMNR4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const storage = getStorage(app);
export { storage };
