import React, { createContext, useState, useContext } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songQueue, setSongQueue] = useState([]);

  return (
    <PlayerContext.Provider value={{ currentSong, setCurrentSong, isPlaying, setIsPlaying, songQueue, setSongQueue }}>
      {children}
    </PlayerContext.Provider>
  );
};