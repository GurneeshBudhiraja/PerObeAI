import React from 'react'

function SingleImage({imageURL, className}) {
  return (
    <img src={imageURL} className={`${className}`} loading='lazy' />
  )
}

export default SingleImage;
