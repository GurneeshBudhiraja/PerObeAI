import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { storage } from "../../firebase/firebaseServices.js";

function FirstStepperContent({ uid, canProceed }) {
  const [isImages, setIsImages] = useState(false);
  const submitImages = async (event) => {
    try {
      const filesData = event.files;
      if (!filesData.length) {
        return;
      }
      setIsImages(true);
      const imageResp = await storage.uploadFile({ uid, files: filesData });
      console.log(imageResp);
      canProceed(true);
    } catch (error) {
      console.log("Error in uploading images", error.message);
    } finally {
      event.options.clear();
    }
  };

  return (
    <FileUpload
      name="uploadClothingItems"
      customUpload={true}
      uploadHandler={submitImages}
      multiple
      accept="image/*"
      previewWidth={50}
      
      contentClassName={`max-h-[11rem] mt-3 overflow-auto ${
        isImages ? "border-2 border-black border-dotted" : ""
      } p-2`}
      
      headerClassName="flex gap-4 items-center justify-center mb-2"
      
      emptyTemplate={
        <div className="flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white/60 shadow-inner ">
          <p className="text-gray-500 font-medium mb-2">
            Drag and drop files here to upload
          </p>
          <p className="text-sm text-gray-400 mt-2">or click to select files</p>
        </div>
      }
    />
  );
}

export default FirstStepperContent;
