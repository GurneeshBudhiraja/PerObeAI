import { auth, fireStore } from "../firebase/firebaseServices.js"; 

export default async function googleSignIn(){
  try {
    const userData = await auth.logInWithGoogle();
    const {uid, email} = userData.user;
    const firestoreData = await fireStore.getData({uid});
    const isNewUser = !Object.keys(firestoreData).length;
    
    if(isNewUser){
      return {isNewUser, uid, email};
    }
    
    const { preferred_fashion_style, accessibility, city} = firestoreData.data;
    
    return {isNewUser, uid, email, preferred_fashion_style, accessibility, city};
  
    
  } catch (error) {
    return error;
  }
}