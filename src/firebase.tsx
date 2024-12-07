
// Firebaseのセットアップ

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAwUTQssx64b9KSVgfNAV8H4loBKlt7EM",
  authDomain: "household-app-c794e.firebaseapp.com",
  projectId: "household-app-c794e",
  storageBucket: "household-app-c794e.firebasestorage.app",
  messagingSenderId: "1036971659262",
  appId: "1:1036971659262:web:54a7b2ee1a44ef6870faaf"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {
  db,
}