import React, { useState } from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";
import { Snackbar, Alert } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/authSlice/authSlice.js";

// Menu logo image
import { MenuLogo } from "../../../assets/assets.jsx";

// Firebase service
import { auth as firebaseAuth } from "../../firebase/firebaseServices.js";

function MenuComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [isLogout, setIsLogout] = useState(false);

  const { email } = useSelector((state) => state.auth);

  return (
    <div className="z-50">
      <Menu
        menuButton={
          <MenuButton>
            <img src={MenuLogo} alt="Menu" className={`w-8 h-8 `} />
          </MenuButton>
        }
        transition
        align="start"
        direction="left"
        arrow
      >
        {/* WELCOME MESSAGE ON THE MENU */}
        {email && (
          <div className="flex items-center px-3 text-sm border-b-[1px] border-gray-300 ">
            Welcome, {email}
          </div>
        )}

        {/* My Wardrobe: To see the uploaded pictures */}
        <MenuItem className={""}>
          <Link to={"/my-wardrobe"}>My Wardrobe</Link>
        </MenuItem>
        {/* ACCOUNT SETTINGS */}

        <MenuItem
          onClick={() => {
            return navigate("/settings");
          }}
          className={"text-gray-800 "}
        >
          Account Settings
        </MenuItem>

        {/* LOGOUT */}
        <MenuItem
          className={"text-red-500"}
          onClick={async () => {
            try {
              setIsLogout(true);
              await firebaseAuth.logOut();
              setTimeout(() => {
                navigate("/");
                dispatch(logoutUser());
              }, 2000);
            } catch (error) {
              setIsLogout(false);
              setError("Unable to logout. Please try again later.");
              return;
            }
          }}
        >
          Logout
        </MenuItem>

        {/* GITHUB LINK */}
        <MenuItem className={"md:hidden"}>
          <Link
            to={"https://github.com/GurneeshBudhiraja/PerObeAI"}
            target="_blank"
            className="text-start"
          >
            <GitHubIcon
              fontSize="large"
              className="text-gray-800 hover:text-gray-600 transition-colors duration-200"
            />
          </Link>
        </MenuItem>
      </Menu>

      {/* alerts */}

      {error && (
        <Snackbar
          open={!!error}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={1100}
          onClose={() => setError("")}
        >
          <Alert
            onClose={() => setError("")}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}

      {isLogout && (
        <Snackbar
          open={!!isLogout}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={1100}
          onClose={() => setIsLogout(false)}
        >
          <Alert
            onClose={() => setIsLogout(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {"You have been logged out successfully"}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default MenuComponent;
