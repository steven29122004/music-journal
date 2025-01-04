import React from "react";
import { usePlayer } from "../context/PlayerContext";

const SongQueue = () => {
  const { songQueue, currentSong } = usePlayer();

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mt-4">
      <div>
        <h3 className="text-xl font-bold mb-2">Now Playing</h3>
        {currentSong ? (
          <div className="mb-4 bg-blue-100 p-2 rounded-lg">
            <div className="flex justify-between items-center">
              <span>{currentSong.name} by {currentSong.artist}</span>
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
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SongQueue;