import React from "react";
import { BigLogo, SmallLogo } from "../../../assets/assets";
import { Link } from "react-router-dom";

function LoginHeader() {
  return (
    <div className="">
      <div className="absolute top-0 left-0 -z-20">
        <div className="h-[30rem] w-screen border rounded-full bg-gradient-to-br from-[#78A3FC] via-[#DDCEEA] to-[#DD4A51] blur-[9rem] lg:blur-[20rem]"></div>
      </div>
      <div className="w-screen h-28 flex justify-start md:h-32 md:mx-auto md:max-w-5xl ">
        <Link to={"/"}>
          <img
            src={BigLogo}
            alt="PerObe AI"
            className=" hidden md:block w-48 h-36 object-contain"
          />
          <img
            src={SmallLogo}
            alt="PerObe AI"
            className="block md:hidden w-24 h-full object-contain ml-3"
          />
        </Link>
      </div>
    </div>
  );
}

export default LoginHeader;
