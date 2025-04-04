import Login from "./pages/Login"
import {Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Game from "./pages/Game";
import Wait from "./pages/Wait";
import IndividualMatch from "./pages/IndividualMatch";
import Spectator from "./pages/spectator";

function App() {

  return (
    <main>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/wait/:id" element={<Wait />} />
          <Route path="/spectate" element={<Spectator/>}/>
          <Route path="/spectate/:id" element={<IndividualMatch/>}/>
        </Routes>
     
    </main>
  )
}

export default App
