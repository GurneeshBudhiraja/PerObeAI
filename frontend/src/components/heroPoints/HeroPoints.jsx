import React from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


function HeroPoints({text, keypoints }) {
  return (
    <>
      <div className='flex items-start'>
        <CheckCircleOutlineIcon className="text-green-400"/>
        <div>{text}</div>
      </div>
      <div>
        {
          keypoints.map((point, index) => {
            return (
              <div key={index} className="">
                <div>{point}</div>
              </div>
            )
          })  
        }
      </div>
      </>
  )
}

export default HeroPoints