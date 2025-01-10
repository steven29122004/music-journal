import React, { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [songQueue, setSongQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false); // State for player visibility

  // Function to reset the player state
  const resetPlayer = () => {
    setCurrentSong(null);
    setSongQueue([]);
    setIsPlaying(false);
    setIsPlayerExpanded(false); // Reset player visibility
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        songQueue,
        setSongQueue,
        isPlaying,
        setIsPlaying,
        volume,
        setVolume,
        isPlayerExpanded,
        setIsPlayerExpanded, // Expose player visibility state
        resetPlayer, // Expose resetPlayer to the context
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);