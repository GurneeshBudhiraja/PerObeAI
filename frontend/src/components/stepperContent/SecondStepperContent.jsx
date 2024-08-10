/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { storage } from "../../firebase/firebaseServices.js";

function SecondStepperContent({ userData = undefined }) {
  const [images, setImages] = useState([]);
  React.useEffect(() => {
    const getImages = async () => {
      try {
        const uid = userData?.uid;
        const imageURLs = await storage.getPictures({uid: uid});
        setImages(imageURLs);
      } catch (error) {
        console.log("Error in SecondStepperContent", error.message);
        setImages([]);
      }
    };
    getImages();
  },[userData]);
  const [city, setCity] = useState(null);
  return (
    <div>
      <InputText value={city} onChange={(e) => setCity(e.target.value)} />
      
    </div>
  );
}

export default SecondStepperContent;
