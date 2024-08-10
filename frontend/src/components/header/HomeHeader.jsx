import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { BigLogo } from "../../../assets/assets";
import GitHubIcon from "@mui/icons-material/GitHub";
import Button from "@mui/material/Button";

function HomeHeader() {
  const appState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(appState.isAuth);
  }, []);

  const headerOptions = [
    {
      show: isAuthenticated,
      name: "userProfile",
    },
    {
      show: !isAuthenticated,
      name: "Sign in",
      url: "/signup",
      className: "",
      style: {
        widht: "100%",
        height: "100%",
        color: "black",
        fontWeight: 600,
        letterSpacing: "0.15rem",
      },
      onClick: "googleSignIn",
      variant: "text",
    },
  ];
  const googleSignIn = () =>{
       
  }
  return (
    <div className="h-[6rem] bg-[#18191a] text-zinc-100 border-b-[0.1rem] border-zinc-600 flex items-center relative px-12 w-full">
      <Link to={"/"} className="items-center">
        <div className="relative h-full">
          <img
            src={BigLogo}
            alt="PerObe AI"
            className="h-full max-h-full invert min-w-max"
          />
        </div>
      </Link>
      <div className="flex-1 flex justify-end items-center">
        {headerOptions.map((option, index) => {
          if (option.show) {
            return (
              <div
                key={index}
                className={`${option.className} mx-4 w-[7rem] text-center py-1 ${option.name==="Sign Up"?"bg-gradient-to-br from-[#8993ee] via-[#9399e2] to-[#eab7da]": "bg-gradient-to-br"} border-2 border- rounded-full cursor-pointer active:opacity-90`}
                onClick={() => {
                  if (option.url) {
                    navigate(option.url);
                  } else {
                    window.open(option.url, "_blank");
                  }
                }}
              >
                <Button
                  variant={option.variant || "contained"}
                  style={{ ...option.style }}
                >
                  {option.name}
                </Button>
              </div>
            );
          }
        })}

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
  );
}

export default HomeHeader;
