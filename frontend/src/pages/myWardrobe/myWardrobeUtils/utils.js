import { storage } from "../../../firebase/firebaseServices.js";

const fetchPictures = async (uid) => {
  /* 
  Gets the uploaded pictures from the firestore using the uid 
  */

  try {
    const pictures = await storage.getPictures({
      uid,
    });

    return pictures;
  } catch (error) {
    // TODO: will remove this later on
    console.log(error);
    return [];
  }
};

export { fetchPictures };