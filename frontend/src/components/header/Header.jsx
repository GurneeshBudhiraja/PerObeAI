// ReactHelmet for setting custom document titles and meta tags in the application
import { ReactHelmet } from "../components.js";
// Check the pathname to determine the appropriate header component to render
import { useLocation } from "react-router-dom";

// Custom header components
import LoginHeader from "./LoginHeader.jsx";
import HomeHeader from "./HomeHeader.jsx";
// Common header component for multiple pages
import CommonHeader from "./CommonHeader.jsx";

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
        <CommonHeader />
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
        <CommonHeader />
      </div>
    );
  }
}

export default Header;
