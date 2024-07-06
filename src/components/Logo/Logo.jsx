import React from 'react';
import {NavLink } from "react-router-dom";
function Logo() {
  return (
    <>
    <NavLink to="/">
      <div className="bg-gradient-to-r cursor-pointer from-[#5082ED] via-[#B36DA9] to-[#D36679] text-transparent bg-clip-text inline-block text-4xl">Perobe AI</div>
    </NavLink>
    </>
  )
}

export default Logo