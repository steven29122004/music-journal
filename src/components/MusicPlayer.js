import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import { FaPlay, FaPause, FaVolumeUp, FaStepBackward, FaStepForward, FaRandom, FaRedo } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";

const MusicPlayer = () => {
  const { currentSong, isPlaying, setIsPlaying } = usePlayer();
  const [volume, setVolume] = useState(0.5); // Default volume: 50%
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sound, setSound] = useState(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: No repeat, 1: Repeat all, 2: Repeat one

  useEffect(() => {
    if (currentSong) {
      if (sound) {
        sound.unload();
      }
      const newSound = new Howl({
        src: [`http://localhost:5000/${currentSong.filePath}`], // Ensure the correct URL
        html5: true,
        volume,
        onplay: () => {
          setDuration(newSound.duration());
        },
        onend: () => {
          if (repeatMode === 2) {
            newSound.play();
          } else {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        },
        onloaderror: (id, error) => {
          console.error("Load error", error);
        },
        onplayerror: (id, error) => {
          console.error("Play error", error);
        }
      });
      setSound(newSound);
      if (isPlaying) {
        newSound.play();
      }
    }
  }, [currentSong, repeatMode]);

  useEffect(() => {
    if (sound) {
      sound.volume(volume);
    }
  }, [volume, sound]);

  useEffect(() => {
    if (sound) {
      if (isPlaying) {
        sound.play();
      } else {
        sound.pause();
      }
    }
  }, [isPlaying, sound]);

  // Update current playback time
  useEffect(() => {
    if (sound && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(sound.seek());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sound, isPlaying]);

  // Change the volume
  const changeVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Seek to a specific position
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (sound) sound.seek(seekTime);
  };

  // Placeholder functions for previous and next buttons
  const handlePrevious = () => {
    // Implement previous song logic
  };

  const handleNext = () => {
    // Implement next song logic
  };

  const handleShuffleToggle = () => {
    setIsShuffle(!isShuffle);
    if (isShuffle) {
      setRepeatMode(0);
    }
  };

  const handleRepeatToggle = () => {
    setRepeatMode((repeatMode + 1) % 3);
    if (repeatMode === 0) {
      setIsShuffle(false);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center">
        <img
          src="https://via.placeholder.com/100"
          alt="Song"
          className="w-16 h-16 rounded-lg mr-4"
        />
        <div>
          <h2 className="text-lg font-bold text-blue-800">{currentSong.name}</h2>
          <p className="text-sm text-blue-600">{currentSong.artist}</p>
        </div>
      </div>
      <div className="flex items-center flex-grow flex-col justify-center">
        <div className="flex items-center mb-2">
          <button 
            onClick={handleShuffleToggle} 
            className={`text-2xl p-4 rounded-full ${isShuffle ? 'bg-yellow-500' : 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600'} shadow-xl transform transition-transform hover:scale-125 hover:text-white mr-2`}
          >
            <FaRandom className="transition-colors duration-300" />
          </button>
          <button
            onClick={handlePrevious}
            className="text-2xl p-4 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-xl transform transition-transform hover:scale-125 hover:text-white mr-2"
          >
            <FaStepBackward className="transition-colors duration-300" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-2xl p-4 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-xl transform transition-transform hover:scale-125 hover:text-white mx-2"
          >
            {isPlaying ? <FaPause className="transition-colors duration-300" /> : <FaPlay className="transition-colors duration-300" />}
          </button>
          <button
            onClick={handleNext}
            className="text-2xl p-4 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-xl transform transition-transform hover:scale-125 hover:text-white ml-2"
          >
            <FaStepForward className="transition-colors duration-300" />
          </button>
          <button 
            onClick={handleRepeatToggle} 
            className={`text-2xl p-4 rounded-full ${repeatMode > 0 ? 'bg-yellow-500' : 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600'} shadow-xl transform transition-transform hover:scale-125 hover:text-white ml-2 relative`}
          >
            <FaRedo className="transition-colors duration-300" />
            {repeatMode === 2 && <span className="absolute top-0 right-0 text-xs text-white">1</span>}
          </button>
        </div>
        <div className="flex items-center w-full justify-center">
          <span className="text-blue-800 mr-2">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-3/4 mx-2"
          />
          <span className="text-blue-800 ml-2">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center">
        <FaVolumeUp className="text-blue-800 mr-2" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={changeVolume}
          className="w-24"
        />
      </div>
    </div>
  );
};

// Helper function to format time in mm:ss
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default MusicPlayer;