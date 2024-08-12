import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CheckAuth, Layout } from "./components/components.js";
import {
  Home,
  Login,
  SignUp,
  NotFound,
  Chat,
  GetStarted,
} from "./pages/pages.js";
import { HelmetProvider } from "react-helmet-async";


function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Layout />}>
            <Route exact path="" element={<Home />} />
            <Route exact path="chat" element={<Chat />} />            
            <Route exact path="login" element={<Login />} />
            <Route exact path="get-started" element={<GetStarted />} />
            <Route exact path="/*" element={<Navigate to={"/"} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
