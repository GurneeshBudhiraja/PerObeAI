import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from "@phosphor-icons/react"

function AuthToggle({type}) {
  return (
    type === 'login' ? (
      <div className='inline-flex gap-2 tracking-wider'>
        <p> Don&#39;t have an account?</p>
        <Link to={"signup"} className='inline-flex items-center justify-center font-semibold  '>
          Sign up
          <ArrowRight size={24} weight='bold' />
        </Link>
      </div>
    ) : (
      <div>
        Have an account? 
        <Link to={"signup"} className='inline-flex items-center justify-center'>
          Log in
          <ArrowRight size={24} weight='bold' />
        </Link>
      </div>
      )
  )
}

export default AuthToggle