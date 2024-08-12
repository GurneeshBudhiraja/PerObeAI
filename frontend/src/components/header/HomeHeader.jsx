import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { BigLogo, SmallLogo } from "../../../assets/assets";
import GitHubIcon from "@mui/icons-material/GitHub";
import Button from "@mui/material/Button";
import { Menu } from "../../components/components.js";

function HomeHeader() {
  const isAuthenticated = useSelector((state) => state.auth.isAuth);
  const navigate = useNavigate();


  return (
    <div className="h-[6rem] border-b-[0.1rem] border-zinc-600 flex items-center  px-10 w-full text-black md:bg-transparent">
      <div className="absolute inset-0 w-full h-full">
        <div className="fixed top-0 left-0 w-screen h-[25rem] bg-gradient-to-br from-[#78A3FC] via-[#DDCEEA] to-[#DD4A51] blur-[20rem] -z-10"></div>
      </div>
      <div className="flex items-center justify-between w-full max-w-prose md:max-w-full ">
        <Link
          to={"/"}
          className="flex items-center justify-center  mt-4 md:mt-0 "
        >
          <div className="">
            <img
              src={BigLogo}
              alt="PerObe AI"
              className="h-full max-h-full hidden md:block"
            />
            <img
              src={SmallLogo}
              alt="PerObe AI"
              className="h-20 w-20 block md:hidden object-contain "
            />
          </div>
        </Link>
        <div className=" flex-1 flex justify-end items-end w-full">
          <div className="flex justify-end items-center w-full gap-6 flex-wrap">
            {isAuthenticated && <Menu />}
            <Link
              to={"https://github.com/GurneeshBudhiraja/PerObeAI"}
              target="_blank"
              className={`mx-4 md:block ${isAuthenticated ? "hidden" : ""}`}
            >
              <GitHubIcon
                fontSize="large"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeHeader;
