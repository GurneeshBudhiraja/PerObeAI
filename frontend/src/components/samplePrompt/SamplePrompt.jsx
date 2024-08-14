import React from 'react'

function SamplePrompt({samplePrompt, onClick, className=""}) {
  return (
    <div onClick={onClick} className={`${className} cursor-pointer w-full text-center `}>
      {samplePrompt}
    </div>
  )
}

export default SamplePrompt;