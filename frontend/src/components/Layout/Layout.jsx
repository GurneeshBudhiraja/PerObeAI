import { Outlet } from "react-router-dom";
import { Header } from "../components.js";
import { Provider } from 'react-redux'
import {store} from "../../store/store.js"

function Layout() {
  return (
    // will add store here
    <Provider store={store}>
      <div className="h-screen w-screen">
        <Header />
        <div>
          <Outlet />
        </div>
      </div>
    </Provider>
    
  );
}

export default Layout;
