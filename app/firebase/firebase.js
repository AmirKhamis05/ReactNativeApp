import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Replace with your Firebase config from Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyDoi3CYnG_sMCjO-ru79BP5-sDWktAK8rM",
  authDomain: "y2-application.firebaseapp.com",
  databaseURL:
    "https://y2-application-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "y2-application",
  storageBucket: "y2-application.firebasestorage.app",
  messagingSenderId: "147495537425",
  appId: "1:147495537425:web:30d57fdfb74cea51085ab0",
  measurementId: "G-SLZBZ8XJQW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { database, auth };
