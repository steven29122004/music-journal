import React from "react";
import { usePlayer } from "../context/PlayerContext";

const SongQueue = () => {
  const { songQueue, setCurrentSong, setIsPlaying } = usePlayer();

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-4">Song Queue</h2>
      <ul>
        {songQueue.map((song, index) => (
          <li key={song._id} className="mb-2">
            <div className="flex justify-between items-center">
              <span>{index + 1}. {song.name} by {song.artist}</span>
              <button
                onClick={() => handlePlaySong(song)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Play
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongQueue;