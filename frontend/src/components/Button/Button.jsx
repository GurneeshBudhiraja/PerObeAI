import React from 'react'

function Button({buttonText,...props}) {
  return (
    <button {...props}>{buttonText}</button>
  )
}

export default Button