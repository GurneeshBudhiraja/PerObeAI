import { initializeApp } from "firebase/app";

import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from "firebase/storage";

import { v4 as uuidv4 } from "uuid";
import firebaseConfig from "./firebaseConfig.js";

// Custom Storage class
class Storage {
  storage;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.storage = getStorage(app);
  }

  // Upload files to Firebase storage
  async uploadFile({ uid, files, metaData = {} }) {
    try {
      const uploadPromises = files.map((file) => {
        const dotIndex = file.name.lastIndexOf(".");
        const extension = dotIndex !== -1 ? file.name.substring(dotIndex) : "";
        const fileName = `${uuidv4()}${extension}`;
        const imageRef = ref(this.storage, `${uid}/${fileName}`);
        return uploadBytes(imageRef, file, metaData);
      });
      return await Promise.all(uploadPromises);
    } catch (error) {
      return {};
    }
  }

  // Get pictures from Firebase storage using uid
  async getPictures({ uid }) {
    try {
      const pictures = [];

      const listRef = ref(this.storage, uid);

      const response = await listAll(listRef);

      // Formatting the response
      for (const item of response.items) {
        const url = await getDownloadURL(item);
        pictures.push({ url });
      }
      return pictures;
    } catch (error) {
      console.log(error)
      throw new Error("Error in getting pictures", error.message);
    }
  }
}

const storage = new Storage();
export default storage;
