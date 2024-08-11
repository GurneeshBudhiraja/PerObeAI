import React from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";
import { MenuLogo } from "../../../assets/assets";

function MenuComponent() {
  return (
    <Menu
      menuButton={
        <MenuButton>
          <img src={MenuLogo} alt="Menu" className={`w-8 h-8 `}  />
        </MenuButton>
      }
      transition
      align="start"
      direction="left"
      arrow
    >
      <MenuItem>Account Settings</MenuItem>
      <MenuItem className={"text-red-500"}>Logout</MenuItem>
    </Menu>
  );
}

export default MenuComponent;
