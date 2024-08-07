import React from "react";
import { BigLogo, SmallLogo } from "../../../assets/assets";
import { AuthToggle } from "../components";
import { Link } from "react-router-dom";

function LoginHeader() {
  return (
    <div className="bg-transparent fixed top-0 z-50 flex items-center justify-between  w-full px-40 -my-8 ">
    <Link to={""}>
        <img src={BigLogo} alt="Perobe AI" className="w-56 h-fit cursor-pointer"/>
      </Link>
      <AuthToggle type={"login"} />
    </div>
  );
}

export default LoginHeader;
