import { Layout,IsAuthenticate } from './components/components.js';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import {Home, NotFound, CheckUserRoute, ShowPictures, Login, SingUp} from "./Pages/pages.js";

function App() {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<IsAuthenticate />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SingUp />} />
        </Route>
        <Route element={<CheckUserRoute />}>
          <Route path="" element={<Home />} />
          <Route path="/showpictures" element={<ShowPictures />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
