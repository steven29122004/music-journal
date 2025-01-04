import React from "react";
import { usePlayer } from "../context/PlayerContext";
import Wavify from "react-wavify";

const SongQueue = () => {
  const { songQueue, currentSong, isPlaying } = usePlayer();

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg mt-4 text-gray-900">
      <div>
        <h3 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Now Playing</h3>
        {currentSong ? (
          <div className="mb-6 bg-blue-100 p-4 rounded-lg shadow-md relative flex items-center">
            <div className="flex-grow">
              <span className="text-lg font-semibold text-gray-900">{currentSong.name} by {currentSong.artist}</span>
            </div>
            <div className="w-16 h-16 ml-4 relative">
              <Wavify
                fill="#3b82f6"
                paused={!isPlaying}
                options={{
                  height: 3,
                  amplitude: 15,
                  speed: 0.2,
                  points: 4,
                }}
                className="absolute bottom-0 left-0 w-full h-full"
              />
            </div>
          </div>
        ) : (
          <p className="mb-6 text-gray-500">No song is currently playing</p>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Up Next</h3>
        <ul>
          {songQueue.filter(song => song._id !== (currentSong && currentSong._id)).map((song, index) => (
            <li key={song._id} className="mb-3">
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition duration-300 shadow-md">
                <span className="text-md text-gray-900">{index + 1}. {song.name} by {song.artist}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SongQueue;