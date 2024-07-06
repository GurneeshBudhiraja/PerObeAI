import React from 'react'

function Button({buttonText}) {
  
  return (
    <button className='h-fit bg-gradient-to-r from-blue-200 to-blue-400 hover:from-blue-400 hover:to-blue-500 
    px-2 py-3 rounded-3xl'>{buttonText}</button>
  )
}

export default Button