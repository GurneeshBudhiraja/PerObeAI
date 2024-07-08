import React, { useState } from 'react'
import {FileInputButton, Button} from "../../components/components.js";
import DeleteButton from "../../assets/deleteButton.jsx";
import {storage} from "../../Firebase/firebaseServices.js";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';
function Home() {
  const [uploadedImages, setUploadedImages] = useState([]); // array of image objects uploaded by the user
  const [isError, setIsError] = useState(""); // boolean to check if there is any error in uploading the images
  const uid = useSelector((state)=>state.auth.uid); // uid of the user
  const submitButton = async () => {
    try {
      setIsError("");
      // checking if the user has uploaded any images or not
      if(!uid) throw new Error("User not logged in");
      if(uploadedImages.length === 0){
        throw new Error("Please upload images to submit.");
      }
      // uploading the images to the firestore
      uploadedImages.forEach(async (image)=>{
        console.log(image);
        const resp = await storage.uploadFile({uid,file:image});
        console.log(resp);
      })
      setUploadedImages([]);
    } catch (error) {
      setIsError(`${error.message}`);
    }
  }

  return (
    <>
    <div className='mb-7'>
      <div className='text-white'>Home</div>
      {/* error message */}
      {isError && <div className='text-red-500'>{isError}</div>}
      {/* file input button to upload images */}
      <FileInputButton
      className='fixed bottom-10 right-5 m-4 z-50 cursor-pointer'
      onChange={(e)=>{
        const filesArray = Array.from(e.target.files);
        setUploadedImages((prev)=>[...filesArray,...prev]);
      }}
      />
      {/* div for showing all the uploaded images by the user */}
      <div className='flex flex-wrap gap-4'>
        {
          uploadedImages.map((image,index)=>{
            return(
              <div key={index} className='relative'>
                <img src={URL.createObjectURL(image)} loading='lazy' alt='uploaded' className='w-64 h-64 object-contain border-2 border-purple-400'/>
                <DeleteButton
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white cursor-pointer"
                onClick={()=>{
                  setUploadedImages((prev)=>prev.filter((item)=>item!==image));
                }}/>
              </div>
            )
          })
        }
      </div>    
      <Button buttonText="Submit" className='w-2/5 h-10 bg-blue-500 text-white'onClick={submitButton}/>
    </div>
    <Link to="/showpictures">
      <Button buttonText="Show My Pictures" className='w-2/5 h-10 bg-blue-500 text-white'/>
    </Link>
  </>
  )
}

export default Home 