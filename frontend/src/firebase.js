// Import necessary Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestore import

// (Optional) If you want analytics, import and initialize it
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDeDdHTJwXpm5c2XOl8_wh58Zc_WGyphGo",
  authDomain: "bharatbiz-43073.firebaseapp.com",
  projectId: "bharatbiz-43073",
  storageBucket: "bharatbiz-43073.appspot.com",
  messagingSenderId: "715890884709",
  appId: "1:715890884709:web:d7024a1fb664704495468c",
  measurementId: "G-QXWY37TXM2",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore services
const auth = getAuth(app);
const db = getFirestore(app);

// (Optional) Initialize analytics if needed
// const analytics = getAnalytics(app);

export { app, auth, db }; // Export app, auth and db instances
