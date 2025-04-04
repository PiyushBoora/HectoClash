import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Game from "./pages/Game";
import Wait from "./pages/Wait";
import Practice from "./pages/Practice";
import Analysis from "./pages/Analysis";

function App() {
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/wait/:id" element={<Wait />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/analysis/:gameId" element={<Analysis />} />
      </Routes>
    </main>
  );
}

export default App;