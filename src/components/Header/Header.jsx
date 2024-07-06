import React from 'react'
import {Logo, SignIn} from "../components.js";
import { useSelector } from 'react-redux';

function Header() {
  const {user,email,uid,isAuth}= useSelector((state) => state.auth);
  return (
     <div className="bg-[#131314] flex justify-between py-4 px-8 border-b-4 border-white">
      <Logo />
      {isAuth?<h1 className='text-white'>Welcome back, {user}</h1>:<SignIn />}
   </div>
  )
}

export default Header