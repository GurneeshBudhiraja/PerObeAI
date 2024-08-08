import React from 'react';
import { ReactHelmet } from '../components.js';
import LoginHeader from "./LoginHeader.jsx";
import { useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  if(location.pathname === "/login" || location.pathname === "/signup") {
    return (
      <div>
        {location.pathname==="/login" ? <ReactHelmet title="Login - PerObe AI" /> : <ReactHelmet title="Sign Up - PerObe AI" />}
        <LoginHeader />
      </div>
    );
  }
}

export default Header