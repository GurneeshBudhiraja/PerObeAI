import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, getDoc, doc } from "firebase/firestore";
import keys from "../keys/keys.js";
import firebaseConfig from "./firebaseConfig.js";

// Custom Firestore class
class FireStore {
  db;
  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  // Add/update data to Firestore
  addData({ uid, data }) {
    try {
      const dataRef = doc(this.db, keys.firebaseFirestoreId, uid);
      return setDoc(dataRef, data, { merge: true });
    } catch (error) {
      return null;
    }
  }

  // Get data from Firestore using uid
  async getData({ uid }) {
    const documentRef = doc(this.db, keys.firebaseFirestoreId, uid);
    try {
      const querySnapshot = await getDoc(documentRef);
      if (querySnapshot.exists()) {
        return querySnapshot.data();
      }
      return {};
    } catch (error) {
      return {};
    }
  }
}

const fireStore = new FireStore();
export default fireStore;
