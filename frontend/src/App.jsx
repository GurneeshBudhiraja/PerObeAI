import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ProtectedRoutes from "./utils/ProtectedRoutes.jsx";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Home />} />
            <Route path="/chat/:id?" element={<Chat />} />            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            {/* <Route path="/get-started" element={<GetStarted />} /> */}
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
