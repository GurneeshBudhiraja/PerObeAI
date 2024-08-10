import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  // TODO: may add the redirect sign in with google
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
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
      reject(error.message);
    }
  });
  };
  deleteUserAccount = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (user) {
        return deleteUser(user);
      } else {
        return {}
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
      return error.message;
    }
  };
  // logging out the user
  logOut = () => {
    try {
      return signOut(this.auth);
    } catch (error) {
      throw new Error(error.message);
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
      throw new Error(error.message);
    }
  };


  // logging in the user with email and password
  logInWithEmail= (email, password)=>{
    try {
      return signInWithEmailAndPassword(this.auth, email, password)

    } catch (error) {
      console.log("Error", error.message)
      return {}  
    }
  }

  signUpWithEmail = ({email, password})=>{
    try {
      return createUserWithEmailAndPassword(this.auth, email, password)
    } catch (error) {
      console.log("Error", error)
      return {}
    }
  }

}

const authClass = new FirebaseAuth();
export default authClass;
