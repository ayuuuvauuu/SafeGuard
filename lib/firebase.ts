import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Added Firestore import just in case, can be removed if not used

// Your web app's Firebase configuration (replace with your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyAgL2WF2v9Aaz00tqRSeI4FxBVYD3IV-pg", // Replace with your actual API key
  authDomain: "women-safety-app-24af0.firebaseapp.com", // Replace with your actual auth domain
  projectId: "women-safety-app-24af0", // Replace with your actual project ID
  storageBucket: "women-safety-app-24af0.firebasestorage.app", // Replace with your actual storage bucket
  messagingSenderId: "1060668038752", // Replace with your actual messaging sender ID
  appId: "1:1060668038752:web:7215d85df2afb1b0ba6d05" // Replace with your actual app ID
  // measurementId: "G-TKTK247XZ7" // Optional measurement ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore, remove if not needed
const provider = new GoogleAuthProvider(); // Create a GoogleAuthProvider instance

// Define the signInWithGoogle function
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // You can access user info and token from the result object if needed
    // const user = result.user;
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential?.accessToken;
    console.log("Google Sign-In successful:", result.user.displayName);
    return result; // Return the result for potential further handling
  } catch (error: any) {
    console.error("Error during Google Sign-In:", error);
    // Handle specific errors if needed
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // const email = error.customData?.email;
    // const credential = GoogleAuthProvider.credentialFromError(error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};

// Export the necessary modules
const storeUserInfo = async (user: any) => { console.log("Placeholder storeUserInfo called with user:", user); };
export { app, auth, db, provider, signInWithGoogle, storeUserInfo };
