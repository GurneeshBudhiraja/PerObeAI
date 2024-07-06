import { Layout } from './components/components.js';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import {Home, NotFound, CheckUserRoute} from "./Pages/pages.js";

function App() {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<CheckUserRoute />}>
          <Route path="" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
