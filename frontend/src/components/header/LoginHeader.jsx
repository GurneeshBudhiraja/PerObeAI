import React from "react";
import { BigLogo, SmallLogo } from "../../../assets/assets";
import { AuthToggle } from "../components";
import { Link, useLocation } from "react-router-dom";

function LoginHeader() {
  const location = useLocation();
  return (

    <div className="flex items-center justify-between w-full px-20 -mt-12 ">
      <div className="absolute top-0 left-0 -z-20">
          <div className="h-[25rem] w-screen border rounded-full bg-gradient-to-br from-[#78A3FC] via-[#DDCEEA] to-[#DD4A51] blur-[20rem]"></div>
      </div>
      <Link to={"/"}>
        <img src={BigLogo} alt="PerObe AI" className="w-56 h-60 object-contain"/>
      </Link>
      {
        location.pathname === "/login" ? <AuthToggle type={"login"} /> : <AuthToggle type={"signup"} />
      }
      
    </div>
  );
}

export default LoginHeader;
