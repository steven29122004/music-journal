import React from "react";
import { usePlayer } from "../context/PlayerContext";

const SongQueue = () => {
  const { songQueue, currentSong, setCurrentSong, setIsPlaying } = usePlayer();

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-4">Song Queue</h2>
      <div>
        <h3 className="text-xl font-bold mb-2">Now Playing</h3>
        {currentSong ? (
          <div className="mb-4 bg-blue-100 p-2 rounded-lg">
            <div className="flex justify-between items-center">
              <span>{currentSong.name} by {currentSong.artist}</span>
              <button
                onClick={() => handlePlaySong(currentSong)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Playing
              </button>
            </div>
          </div>
        ) : (
          <p className="mb-4">No song is currently playing</p>
        )}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">Up Next</h3>
        <ul>
          {songQueue.filter(song => song._id !== (currentSong && currentSong._id)).map((song, index) => (
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
    </div>
  );
};

export default SongQueue;