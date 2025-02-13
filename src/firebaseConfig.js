import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut  } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

import { getDatabase, ref, onValue, child, get } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";


var loggedIn = false


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

//const db = getDatabase(app)



//const dbRef = ref(db)
/* get(child(dbRef, "/1")).then((snapshot) => {
    console.log(snapshot.val())
}) */

const auth = getAuth();


export async function handleGoogleLogIn () {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      window.location.href = "./utils/pages/dashboard.html"
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorMessage)
      // ...
    });
};

export async function handleGoogleSignOut () {
  signOut(auth)
    .then((result) => {
      console.log("Sign out successful")
      window.location.href = "/index.html"

    }).catch((err) => {
      console.log("Sign out error")
    })
}

export default loggedIn;
