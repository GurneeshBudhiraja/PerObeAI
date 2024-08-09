import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout,  } from "./components/components.js";
import { Home, Login, SignUp, NotFound, Chat } from "./pages/pages.js";
import {HelmetProvider} from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />} />
          <Route path="/login" element={<Login />}  />
          <Route path="/signup" element={<SignUp />}  />
          <Route path="/chat/:id?" element={<Chat />}  />
          <Route path="/*" element={<NotFound />}  />
        </Route>
      </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
