// Import and configure Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRyDuukKz7fVs31l5UJNK8FP1pAz2FOtg",
  authDomain: "milestone-6853b.firebaseapp.com",
  projectId: "milestone-6853b",
  storageBucket: "milestone-6853b.appspot.com",
  messagingSenderId: "239547794386",
  appId: "1:239547794386:web:eecdcbb6be395301b37e0b",
  measurementId: "G-E5BXDQDGXX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
