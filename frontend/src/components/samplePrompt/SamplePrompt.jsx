import React from 'react'

function SamplePrompt({samplePrompt, onClick, className=""}) {
  return (
    <div onClick={onClick} className={`${className} cursor-pointer`}>
      {samplePrompt}
    </div>
  )
}

export default SamplePrompt;