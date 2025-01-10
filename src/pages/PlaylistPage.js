import React from "react";
import Playlist from "../components/Playlist";
import PlayerPage from "./PlayerPage";
import { usePlayer } from "../context/PlayerContext";

const PlaylistPage = () => {
  const { setCurrentSong, setIsPlaying, setIsPlayerExpanded } = usePlayer();

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setIsPlayerExpanded(true); // Expand the player
  };

  return (
    <div className="relative">
      <Playlist onPlaySong={handlePlaySong} />
      <PlayerPage />
    </div>
  );
};

export default PlaylistPage;
