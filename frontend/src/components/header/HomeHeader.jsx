import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { BigLogo } from "../../../assets/assets";
import GitHubIcon from "@mui/icons-material/GitHub";
import Button from "@mui/material/Button";
import { Menu } from "../../components/components.js";

function HomeHeader() {
  const isAuthenticated = useSelector((state) => state.auth.isAuth);
  const navigate = useNavigate();

  const headerOptions = [
  ];

  return (
    <div className="h-[6rem] border-b-[0.1rem] border-zinc-600 flex items-center  px-10 w-full text-black bg-transparent">
      <div className="absolute inset-0 w-full h-full">
        <div className="fixed top-0 left-0 w-screen h-[25rem] bg-gradient-to-br from-[#78A3FC] via-[#DDCEEA] to-[#DD4A51] blur-[20rem] -z-10"></div>
      </div>
      {/* Fixed background gradient */}
      <Link to={"/"} className="items-center">
        <div className="relative h-full">
          <img
            src={BigLogo}
            alt="PerObe AI"
            className="h-full max-h-full min-w-max"
          />
        </div>
      </Link>
      <div className="flex-1 flex justify-end items-center">
        <div className="flex justify-end items-center w-full gap-6 flex-wrap">
          {isAuthenticated && <Menu />}
          <Link
            to={"https://github.com/GurneeshBudhiraja/PerObeAI"}
            target="_blank"
            className="mx-4"
          >
            <GitHubIcon
              fontSize="large"
              style={
                {
                  // TODO: Fix this style
                }
              }
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomeHeader;
