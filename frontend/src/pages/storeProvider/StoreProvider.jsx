import { Outlet } from "react-router-dom";
import { Header } from "../../components/components.js";
import { Provider } from "react-redux";
import { store } from "../../store/store.js";

function StoreProvider() {
  return (
    <Provider store={store}>
      <div className="w-screen h-screen flex flex-col overflow-auto">
        <Header />
        <Outlet />
      </div>
    </Provider>
  );
}

export default StoreProvider;
