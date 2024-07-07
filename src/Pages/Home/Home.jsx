import React from 'react'
import {FileInputButton, SingleImage} from "../../components/components.js"
import DeleteButton from "../../assets/deleteButton.jsx";
function Home() {
  const [uploadedImageArray, setUploadedImageArray] = React.useState([]); // Array of image URLs uploaded by the user
  const [hoveredIndex, setHoveredIndex] = React.useState(null); // showing delete button on hover
  return (
    <div className=''>
      <div className='text-white'>Home</div>
      <FileInputButton
      className='fixed bottom-10 right-5 m-4 z-50'
      onFileChange={(e)=>{
        const files = e.target.files;
        const fileArray = Array.from(files);
        const fileArrayURL = fileArray.map((file) => URL.createObjectURL(file));
        setUploadedImageArray((prevArray)=>[...fileArrayURL,...prevArray]);
      }}
      />
      <div className='flex flex-wrap gap-4' >
        {uploadedImageArray.map((imageURL, index) => (
          <div 
          key={index} 
          className='w-64 h-64 flex justify-center relative' 
          onMouseEnter={()=>{
            setHoveredIndex(index);
          }}
          onMouseLeave={()=>{
            setHoveredIndex(null)
          }}
          >
            <div className={`z-50 absolute -right-3 -top-3 cursor-pointer bg-[#5780E8] transition-opacity duration-300 ${hoveredIndex===index?"opacity-100":"opacity-0"} p-2 rounded-full`}
            onClick={()=>{
              const newArray = [...uploadedImageArray];
              newArray.splice(index, 1);
              setUploadedImageArray(newArray);
            }}
            >
              <DeleteButton className={``} />
            </div>
            <SingleImage imageURL={imageURL} className="border-2 border-purple-400 rounded-lg object-contain " />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home 