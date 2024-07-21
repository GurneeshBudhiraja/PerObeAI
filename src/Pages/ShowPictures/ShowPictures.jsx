import React from 'react'
import {storage} from "../../Firebase/firebaseServices.js";
import {useSelector} from "react-redux";
function ShowPictures() {
  const uid = useSelector((state)=>state.auth.uid); // uid of the user
  const [userImages, setUserImages] = React.useState([]); // array of images in the cloud storage
  const [isError, setIsError] = React.useState(""); // boolean to check if there is any error in fetching the images
  const [isEmpty, setIsEmpty] = React.useState(false); // State to track if the array is empty
  React.useEffect(()=>{
    async function fetchImages(){
      try {
        setIsError("");
        // getting the images from the firestore
        const pictures = await storage.getPictures({uid});
        console.log(pictures);
        setUserImages(pictures);
        if(pictures.length === 0){
          setIsEmpty(true);
        } else{
          setIsEmpty(false);
        }
      } catch (error) {
        setIsError(error.message);
      }
    }
    fetchImages();
  },[uid]);
  return (
    <>
      {isError && <div className='text-red-500'>{isError}</div>}
      {isEmpty && <div className='text-red-500'>No images found</div>}
      <div className='flex flex-wrap gap-4 mt-4'>
        {
          userImages.map((url,index)=>(
            <img key={index} src={url} loading='lazy' className='w-64 h-64 object-contain border-2 border-purple-400 '/>
          ))
        }
      </div>
    </>
  )
}

export default ShowPictures