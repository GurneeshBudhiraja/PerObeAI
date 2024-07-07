import React from 'react'
import AddCircleIcon from "../../assets/add-circle-stroke-rounded.jsx"

function FileInputButton({onFileChange, className=""}) {
  const inputRef = React.useRef(null);
  function buttonClicked(){
    inputRef.current.click();
  }
  return (
    <>
    <AddCircleIcon onClick={buttonClicked} className={`${className}`} />
    <input
    ref={inputRef}
    type='file'
    accept='image/*'
    multiple
    onChange={onFileChange}
    hidden={true}
    />
    </>
  )
}

export default FileInputButton;