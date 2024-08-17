import { initializeApp } from "firebase/app";

import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";

// Firebase configuration
import firebaseConfig from "./firebaseConfig.js";

// Custom authentication class
class FirebaseAuth {
  auth;
  provider;

  // Initialize Firebase
  constructor() {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.provider = new GoogleAuthProvider();
  }

  // Get current user
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

  // Delete user account
  deleteUserAccount = async () => {
    try {
      const user = this.auth.currentUser;

      if (user) {
        return deleteUser(user);
      } else {
        return {};
      }
    } catch (error) {
      return error.message;
    }
  };

  // Log out the user
  logOut = () => {
    try {
      return signOut(this.auth);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Google login
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

  // Email and password login
  logInWithEmail = async ({ email, password }) => {
    try {
      return signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      return {}
    }
  };

  // Email and password sign up
  signUpWithEmail = ({ email, password }) => {
    try {
      return createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      return {};
    }
  };
}

const authClass = new FirebaseAuth();

export default authClass;
