import React, { useState } from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";
import { MenuLogo } from "../../../assets/assets";
import { auth as firebaseAuth } from "../../firebase/firebaseServices.js";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/authSlice/authSlice.js";

function MenuComponent() {
  
  const [error, setError] = useState("");
  const [isLogout, setIsLogout] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  return (
    <>
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

      <MenuItem onClick={()=>{
        return navigate("/account-settings");
      }}>Account Settings</MenuItem>
      <MenuItem
        className={"text-red-500"}
        onClick={async () => {
          try {
            setIsLogout(true);
            await firebaseAuth.logOut();
            dispatch(logoutUser());
            setTimeout(()=>{
              navigate("/");    
            },2000);
          } catch (error) {
            setIsLogout(false);
            setError("Unable to logout. Please try again later.");
            return;
          }
        }}
      >
        Logout
      </MenuItem>
    </Menu>


    {/* user alerts */}
    {error && <Snackbar
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
    </Snackbar>}
    {isLogout && <Snackbar
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
        {'You have been logged out successfully'}
      </Alert>
    </Snackbar>}
    </>
  );
}

export default MenuComponent;
