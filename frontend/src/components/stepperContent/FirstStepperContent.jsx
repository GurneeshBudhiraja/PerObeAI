import { useState } from "react";
import { FileUpload } from "primereact/fileupload";

// Firebase service
import { storage } from "../../firebase/firebaseServices";

function FirstStepperContent({
  uid,
  canProceed,
  setIsLoading,
  setError,
  setSuccess,
}) {
  const [isImages, setIsImages] = useState(false);

  // Function to upload images to firebase storage
  const submitImages = async (event) => {
    try {
      setIsLoading(true);
      const filesData = event.files;

      if (!filesData.length) {
        return;
      }

      setIsImages(true);

      await storage.uploadFile({ uid, files: filesData });

      setIsLoading(false);

      setSuccess("Images uploaded successfully");

      canProceed(true);
    } catch (error) {
      canProceed(false);

      setError("Error in uploading images. Please try again");
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
      contentClassName="max-h-[11rem] mt-3 overflow-auto"
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
