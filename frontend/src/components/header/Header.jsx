import React from "react";
import { ReactHelmet } from "../components.js";
import { useLocation } from "react-router-dom";

import LoginHeader from "./LoginHeader.jsx";
import HomeHeader from "./HomeHeader.jsx";
import ChatHeader from "./ChatHeader.jsx";

function Header() {
  const location = useLocation();
  if (location.pathname === "/login") {
    return (
      <div>
        <ReactHelmet title="Login - PerObe AI" />
        <LoginHeader />
      </div>
    );
  } else if (location.pathname === "/") {
    return (
      <div>
        <ReactHelmet title="Home - PerObe AI" />
        <HomeHeader />
      </div>
    );
  } else if (location.pathname === "/chat") {
    return (
      <div>
        <ReactHelmet title="Chat - PerObe AI" />
        <ChatHeader />
      </div>
    );
  } else if (location.pathname === "/get-started") {
    return (
      <div>
        <ReactHelmet title="Get Started - PerObe AI" />
      </div>
    );
  } else if (location.pathname === "/settings") {
    return (
      <div>
        <ReactHelmet title="Settings - PerObe AI" />
      </div>
    );
  } else if (location.pathname === "/my-wardrobe") {
    return (
      <div>
        <ReactHelmet title="Wardrobe - PerObe AI" />
        <ChatHeader />
      </div>
    );
  }
}

export default Header;
