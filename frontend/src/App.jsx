import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, Login, SignUp } from "./components/components.js";
import {HelmetProvider} from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login />}  />
          <Route path="/signup" element={<SignUp />}  />
        </Route>
      </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
