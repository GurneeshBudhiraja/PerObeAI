import React from 'react'
import AddCircleIcon from "../../assets/add-circle-stroke-rounded.jsx"

function FileInputButton({className="",...props}) {
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
    hidden={true}
    {...props}
    />
    </>
  )
}

export default FileInputButton;