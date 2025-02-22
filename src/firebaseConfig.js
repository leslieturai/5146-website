// Importing necessary firebase module functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js"

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut  } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

import { getDatabase, ref, child, get, set, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

///
// Configuring firebase instance
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
// Variables for database and authorization
const db = getDatabase(app)
const dbRef = ref(db)
const auth = getAuth();

// Variables for testing, but also to show example structure of the actual budget object
// userBudget2 demonstrates a budget that has content
var userBudget2 = {
  "userBudget": {
      "setBudget": 500,
      "expenses": [
          {
              "id": 0,
              "label": "Groceries",
              "cost": 350
          },
          {
              "id": 1,
              "label": "Train",
              "cost": 5
          },
          {
              "id": 2,
              "label": "The Strokes Tickets",
              "cost": 35
          }
      ]
  }
}
// No content example - this will be read as null by the app and treated as such by firebase as well
var userBudget = {
  "userBudget": {
      "setBudget": 0, // setBudget being zero means no data
      "expenses": [ // As expenses is empty, it will not appear in the database, making the budget null

      ]
  }
}

// Function called in index.html to handle logging in
export async function handleGoogleLogIn () {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      // The signed-in user info.
      const user = result.user
      window.location.href = "./utils/pages/dashboard.html"
    }).catch((error) => {
      // Handle Errors
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log(errorMessage)
    })
}
// Function to handle signing out - called in dashboard.html
export async function handleGoogleSignOut () {
  signOut(auth)
    .then((result) => {
      console.log("Sign out successful")
      window.location.href = "/index.html"

    }).catch((err) => {
      console.log("Sign out error")
    })
}

// Async function to retrieve the budget if it exists
export async function getBudget() {
  try {
    const snapshot = await get(child(dbRef, "/0"))
    if (snapshot.val() == null) {
      console.log("no expenses")
      return // If no expenses, return nothing
    }
    return snapshot.val() // Otherwise, we return the budget object
  } catch (err) {
    console.error(err)
    return null
  }
}
// Function to delete budget, used to reset 
export async function deleteSavedBudget () {
  try {
    const pathRef = ref(db, "/0"); 
    await remove(pathRef)
    console.log("Data deleted successfully")
  } catch (error) {
    console.error("Error deleting data:", error)
  } 
} 
// Function to set the budget after deleteSavedBudget() is called
export async function setBudget (newBudget) {
  try {
    set(ref(db, "0"), newBudget )
    console.log("Saved to database")
  } catch (error) {
    console.error("Error setting data:", error)
  }
}

// Testing functions to clear the database and write test data
//deleteSavedBudget()
//setBudget(userBudget2)

// Function to delete one expense, found in Real Time Database via its id
export async function deleteDBexpense (id) {
  try {
    const pathRef = ref(db, "/0/userBudget/expenses/" + id); 
    await remove(pathRef)
    console.log("expense deleted successfully")
  } catch (error) {
    console.error("Error deleting data:", error)
  } 
} 

