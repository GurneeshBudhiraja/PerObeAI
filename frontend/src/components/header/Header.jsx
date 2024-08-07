import React from 'react';
import { ReactHelmet } from '../components.js';
import LoginHeader from "./LoginHeader.jsx";
import { useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  if(location.pathname === "/login") {
    return (
      <div>
        <ReactHelmet title="Login - PerObe AI" />
        <LoginHeader />
      </div>
    );
  }
}

export default Header