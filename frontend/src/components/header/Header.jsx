import React from 'react';
import { ReactHelmet } from '../components.js';
import LoginHeader from "./LoginHeader.jsx";
import HomeHeader from './HomeHeader.jsx';
import ChatHeader from './ChatHeader.jsx';
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
  } else if (location.pathname==="/") {
    return (
      <div>
        <ReactHelmet title="Home - PerObe AI" />
        < HomeHeader/>
      </div>
    );
  } else if (location.pathname==="/chat") {
    return (
      <div>
        <ReactHelmet title="Chat - PerObe AI" />
      </div>
    );
  }
}

export default Header