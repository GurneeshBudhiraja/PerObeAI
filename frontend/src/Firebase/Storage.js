import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import firebaseConfig from "./firebaseConfig.js";
import { v4 as uuidv4 } from "uuid";
class Storage{
  storage;
  constructor(){
  const app = initializeApp(firebaseConfig);
  this.storage = getStorage(app);
  }

  uploadFile({uid,file,metaData={}}){
    try {
      const fileName = file.name.split(".")[0] + uuidv4() + "." + file.name.split(".")[1];
      const imageRef = ref(this.storage, `${uid}/${fileName}`);
      return uploadBytes(imageRef, file,metaData);
    }catch (error) {
      console.log(`Error in uploading pictures :: ${error.message}`);
      throw error;
    }
  }

  async getPictures({ uid }) {
  try{
    const pictures = [];
    const listRef = ref(this.storage, uid); // Reference to the file

    const response = await listAll(listRef)
    console.log(response);
    for (const item of response.items){
      const url = await getDownloadURL(item);
      pictures.push(url);
    }
    return pictures;
  } catch(error){
      console.log(`Error in getting pictures :: ${error.message}`);
      throw new Error("Error in getting pictures",error.message);
    }
  }
}



const storage = new Storage();
export default storage;