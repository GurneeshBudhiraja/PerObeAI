import { auth, fireStore } from "../firebase/firebaseServices.js";

export default async function googleSignIn() {
  /*
    Wrapper function for the Google sign-in process that verifies whether the user is new or not. Also, it fetches the user's data from Firestore if the user is not new.
  */
  try {
    const userData = await auth.logInWithGoogle();

    const { uid, email, accessToken } = userData.user;

    const firestoreData = await fireStore.getData({ uid });

    const isNewUser = !Object.keys(firestoreData).length;

    if (isNewUser) {
      return { isNewUser, uid, email };
    }

    const { preferred_fashion_style, accessibility, city } = firestoreData;

    return {
      isNewUser,
      uid,
      email,
      preferred_fashion_style,
      accessibility,
      city,
      accessToken,
      isAuth: true,
    };
  } catch (error) {
    return error;
  }
}
