import React from 'react'
import { FileUpload } from 'primereact/fileupload';
import {storage} from "../../firebase/firebaseServices.js";

function FirstStepperContent({uid, canProceed}) {
  const submitImages = async (event)=>{
    try {
      const filesData = event.files;
      const imageResp = await storage.uploadFile({uid, files:filesData})
      console.log(imageResp);
      canProceed(true);
    } catch (error) {
      console.log("Error in uploading images",error.message);
    } finally{
      event.options.clear();
    }
  }

  return (
    <FileUpload name="uploadClothingItems" customUpload={true} uploadHandler={submitImages} multiple accept="image/*" previewWidth={50} emptyTemplate={<p className="">Drag and drop files to here to upload.</p>} />

  )
}

export default FirstStepperContent