import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer } from "../components.js";
import { Provider } from "react-redux";
import store from "../../store/store.js";

function Layout() {
  return (
    // will add store here
    <Provider store={store}>
      <div className="flex flex-col justify-between h-screen">
        <Header />
        <div className="bg-[#131314] h-full overflow-scroll text-white">
          <Outlet />
        </div>
        <Footer />
      </div>
    </Provider>
  );
}

export default Layout;
