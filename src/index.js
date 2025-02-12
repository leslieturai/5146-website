import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

import { Database, getDatabase, ref, onValue, child, get } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAKsJC-oY99grk3vOF1jqnGG2Xhpaxcyn8",
    authDomain: "midterm-8c698.firebaseapp.com",
    databaseURL: "https://midterm-8c698-default-rtdb.firebaseio.com",
    projectId: "midterm-8c698",
    storageBucket: "midterm-8c698.firebasestorage.app",
    messagingSenderId: "641989976699",
    appId: "1:641989976699:web:ac10fa5e3ec026ce1db8de",
    measurementId: "G-B7D6VQWP0D"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getDatabase(app)


const dbRef = ref(db)
/* get(child(dbRef, "/1")).then((snapshot) => {
    console.log(snapshot.val())
}) */