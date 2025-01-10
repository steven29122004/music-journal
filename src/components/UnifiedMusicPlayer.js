import React, { useState, useEffect, useContext } from "react";
import { Howl } from "howler";
import { usePlayer } from "../context/PlayerContext";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaRedo } from "react-icons/fa";

const UnifiedMusicPlayer = () => {
    const {
        currentSong,
        songQueue,
        isPlaying,
        setIsPlaying,
        volume,
        setVolume,
        skipSong,
      } = usePlayer();
      

  const [howl, setHowl] = useState(null);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (currentSong) {
      if (howl) {
        howl.unload();
      }

      const newHowl = new Howl({
        src: [`http://localhost:5000/${currentSong.filePath}`],
        volume: volume,
        onend: () => {
          if (isRepeat) {
            newHowl.play();
          } else {
            skipSong(1);
          }
        },
      });
      setHowl(newHowl);

      if (isPlaying) {
        newHowl.play();
      }
    }
  }, [currentSong]);

  useEffect(() => {
    if (howl) {
      howl.volume(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (howl) {
      if (isPlaying) {
        howl.play();
      } else {
        howl.pause();
      }
    }
  }, [isPlaying]);

  if (!currentSong) {
    return null;
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  return (
    <>
      {/* Global Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center cursor-pointer" onClick={toggleDetails}>
          <img
            src={`http://localhost:5000/${currentSong.imagePath}` || "/placeholder.png"}
            alt="Song"
            className="w-16 h-16 rounded-lg mr-4"
          />
          <div>
            <h2 className="text-lg font-bold">{currentSong.name}</h2>
            <p className="text-sm">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <button onClick={() => skipSong(-1)} className="text-white text-2xl">
            <FaStepBackward />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white text-2xl"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={() => skipSong(1)} className="text-white text-2xl">
            <FaStepForward />
          </button>
          <button
            onClick={toggleRepeat}
            className={`text-white text-2xl ${isRepeat ? "text-blue-400" : ""}`}
          >
            <FaRedo />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center">
          <FaVolumeUp className="mr-2" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-2 bg-gray-600 rounded-lg appearance-none"
          />
        </div>
      </div>

      {/* Detailed Playback View */}
      {showDetails && (
        <div className="fixed inset-0 bg-gradient-to-b from-blue-500 to-blue-900 text-white p-8 flex flex-col items-center z-50">
          <button
            onClick={toggleDetails}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            &times;
          </button>
          <img
            src={`http://localhost:5000/${currentSong.imagePath}` || "/placeholder.png"}
            alt="Song"
            className="w-64 h-64 object-cover rounded-md shadow-lg mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">{currentSong.name}</h1>
          <h2 className="text-xl text-gray-300 mb-2">{currentSong.artist}</h2>
          <p className="text-gray-400 mb-1">Mood: {currentSong.mood}</p>
          <p className="text-gray-400 mb-1">Tags: {currentSong.tags?.join(", ")}</p>
          <p className="text-gray-400 text-center max-w-lg mb-4">
            {currentSong.journal}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => skipSong(-1)}
              className="text-white bg-gray-800 p-4 rounded-full"
            >
              <FaStepBackward />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white bg-gray-800 p-4 rounded-full"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={() => skipSong(1)}
              className="text-white bg-gray-800 p-4 rounded-full"
            >
              <FaStepForward />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UnifiedMusicPlayer;
