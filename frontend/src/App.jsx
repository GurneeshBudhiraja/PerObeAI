import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CheckAuth } from "./components/components.js";
import {
  Home,
  Login,
  SignUp,
  NotFound,
  Chat,
  GetStarted,
  AccountSettings,
} from "./pages/pages.js";
import StoreProvider from "./pages/storeProvider/StoreProvider.jsx";
import { HelmetProvider } from "react-helmet-async";


function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<StoreProvider />}>
            <Route exact path="" element={<Home />} />
            <Route exact path="chat" element={<Chat />} />            
            <Route exact path="login" element={<Login />} />
            <Route exact path="get-started" element={<GetStarted />} />
            <Route exact path="settings" element={<AccountSettings />} />
            <Route exact path="/*" element={<Navigate to={"/"} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
