import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import keys from "../keys/keys.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: keys.firebaseAPIKey,
  authDomain: keys.firebaseAuthDomain,
  projectId: keys.firebaseProjectId,
  storageBucket: keys.firebaseStorageBucket,
  messagingSenderId: keys.firebaseMessagingSenderId,
  appId: keys.firebaseAppId
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();
  
// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({   
    prompt : "select_account "
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

