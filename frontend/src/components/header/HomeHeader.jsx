import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { BigLogo } from "../../../assets/assets";
import GitHubIcon from "@mui/icons-material/GitHub";
import Button from "@mui/material/Button";

function HomeHeader() {
  const isAuthenticated = useSelector((state) => state.auth.isAuth);
  const navigate = useNavigate();

  // State to manage delay for showing the button
  const [showSignInButton, setShowSignInButton] = useState(false);

  // Delay effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSignInButton(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const headerOptions = [
    {
      show: !isAuthenticated && showSignInButton,
      name: "Sign in",
      url: "/signup",
      className: "",
      style: {
        width: "100%",
        height: "100%",
        color: "black",
        fontWeight: 600,
        letterSpacing: "0.15rem",
      },
      onClick: "googleSignIn",
      variant: "text",
    },
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
          {headerOptions.map((option, index) => {
            if (option.show) {
              return (
                <div
                  key={index}
                  className={`${
                    option.className
                  } mx-4 w-[7rem] text-center py-1 ${
                    option.name === "Sign Up"
                      ? "bg-gradient-to-br from-[#8993ee] via-[#9399e2] to-[#eab7da]"
                      : "bg-gradient-to-br"
                  } border-2 border- rounded-full cursor-pointer active:opacity-90`}
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
            return null; // Add return null to avoid warnings
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
