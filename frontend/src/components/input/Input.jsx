import React from 'react'
import { TextField } from '@mui/material';


function Input({ labelName, type, className,isRequired,name, props   }) {
  return (
    <TextField
    name={name}
    required={isRequired}
    label={labelName}
    type={type}
    className={className}
    {...props}
    />
  )
}

export default Input