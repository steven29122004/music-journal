import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PlaylistPage from "./pages/PlaylistPage";
import { PlayerProvider } from "./context/PlayerContext";
import MusicPlayer from "./components/MusicPlayer";

const App = () => {
  return (
    <PlayerProvider>
      <Router>
        <nav>
          <a href="/">Home</a>
          <a href="/playlist">Playlist</a>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlist" element={<PlaylistPage />} />
        </Routes>
        <MusicPlayer />
      </Router>
    </PlayerProvider>
  );
};

export default App;