import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PlaylistPage from "./pages/PlaylistPage";
import PlayerPage from "./pages/PlayerPage";
import { PlayerProvider } from "./context/PlayerContext";
import MusicPlayer from "./components/MusicPlayer";
import NavigationBar from "./components/NavigationBar";

const App = () => {
  return (
    <PlayerProvider>
      <Router>
      <NavigationBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/player" element={<PlayerPage />} />
        </Routes>
        <MusicPlayer />
      </Router>
    </PlayerProvider>
  );
};

export default App;
