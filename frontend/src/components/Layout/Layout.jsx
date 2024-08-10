import { Outlet } from "react-router-dom";
import { Header } from "../components.js";
import { Provider } from 'react-redux'
import {store} from "../../store/store.js"
import { useEffect } from "react";
import { useSelector } from "react-redux";

function Layout() {

  return (
    // will add store here
    <Provider store={store}>
      <div className="w-screen h-screen flex flex-col overflow-auto">
          <Header />
          <Outlet />
      </div>
    </Provider>
    
  );
}

export default Layout;
