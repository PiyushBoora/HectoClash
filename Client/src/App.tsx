import Login from "./pages/Login"
import {Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Game from "./pages/Game";
import Wait from "./pages/Wait";
import IndividualMatch from "./pages/IndividualMatch";
import Practice from "./pages/Practice";
import Analysis from "./pages/Analysis";
import Header from "./components/Header";
import RandomMatch from "./pages/RandomMatch";
import Spectator from "./pages/Spectator";

import About from "./pages/About";
function App() {

  return (
    <main>
        <Header/>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/wait/:id" element={<Wait />} />
          <Route path="/about" element={<About />} />
          <Route path="/spectate" element={<Spectator/>}/>
          <Route path="/spectate/:id" element={<IndividualMatch/>}/>
          <Route path="/practice" element={<Practice />} />
          <Route path="/analysis/:gameId" element={<Analysis />} />
          <Route path="/random/match" element={<RandomMatch />} />
        </Routes>
    </main>
  )
}

export default App



