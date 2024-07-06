import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import firebaseConfig from "./firebaseConfig.js";

class FirebaseAuth {
  auth;
  provider;
  constructor() {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.provider = new GoogleAuthProvider();
  }

  // getting the current user
  currentUser = () => {
   return new Promise((resolve, reject) => {
     try {
       onAuthStateChanged(this.auth, (user) => {
         if (user) {
           resolve(user);
         } else {
           resolve(null);
         }
       });
     } catch (error) {
       reject(error);
     }
   });
 };

  // logging out the user
  logOut = () => {
    try {
      return signOut(this.auth);
    } catch (error) {
      return { error: error.message };
    }
  };

  // logging in the user with google
  logInWithGoogle = () => {
    try {
      this.provider.setCustomParameters({
        prompt: "select_account ",
      });
      return signInWithPopup(this.auth, this.provider);
    } catch (error) {
      return { error: error.message };
    }
  };
}

const authClass = new FirebaseAuth();
export default authClass;
