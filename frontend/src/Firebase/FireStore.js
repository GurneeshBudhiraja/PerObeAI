import { initializeApp } from "firebase/app";
import { 
  getFirestore,
  setDoc,
  getDoc,
  where,
  query,
  doc,
  collection
} from "firebase/firestore";
import keys from "../keys/keys.js";
import firebaseConfig from "./firebaseConfig.js";

class FireStore{
  db;
  constructor(){
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  addData({uid,...data}){
    try {
      const dataRef = doc(this.db, keys.firebaseFirestoreId,uid);
      return setDoc(dataRef, data,{merge:true});
    
    } catch (error) {
      console.log("Error", error.message)
      return null;
    }
  }

  async getData({uid}){
    const documentRef = doc(this.db, keys.firebaseFirestoreId,uid);
    try {
      const querySnapshot = await getDoc(documentRef);
      if(querySnapshot.exists()){
        return querySnapshot.data();
      }
      return {};
    } catch (error) {
      console.log("Error", error.message)
      return null;
    }
  }
}


const fireStore = new FireStore();
export default fireStore;