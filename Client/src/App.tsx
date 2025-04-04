import Home from "./pages/Home";
import Login from "./pages/Login"
import {Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Game from "./pages/Game";
import Wait from "./pages/Wait";

function App() {

  return (
    <main>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/wait/:id" element={<Wait />} />
        </Routes>
     
    </main>
  )
}

export default App
