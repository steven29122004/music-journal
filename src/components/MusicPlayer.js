import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepBackward, FaStepForward, FaRandom, FaSyncAlt, FaRedoAlt, FaListUl } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";
import { motion, AnimatePresence } from "framer-motion";


  const MusicPlayer = () => {
    const {
      currentSong,
      isPlaying,
      setIsPlaying,
      songQueue,
      setCurrentSong
    } = usePlayer();
  const [volume, setVolume] = useState(0.5); // Default volume: 50%
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sound, setSound] = useState(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [shuffledQueue, setShuffledQueue] = useState([]);
  const [repeatMode, setRepeatMode] = useState(0); // 0: No repeat, 1: Repeat all, 2: Repeat one
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    if (currentSong) {
      if (sound) {
        sound.unload();
      }
      const newSound = new Howl({
        src: [`http://localhost:5000/${currentSong.filePath}`],
        html5: true,
        volume: isMuted ? 0 : volume,
        onplay: () => {
          setDuration(newSound.duration());
        },
        onend: () => {
          if (repeatMode === 2) {
            newSound.play();
          } else {
            handleNext();
          }
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
      sound.volume(isMuted ? 0 : volume);
    }
  }, [volume, sound, isMuted]);

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
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Seek to a specific position
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (sound) sound.seek(seekTime);
  };

  // Handle previous song
  const handlePrevious = () => {
    const currentIndex = (isShuffle ? shuffledQueue : songQueue).findIndex(song => song._id === currentSong._id);
    if (currentIndex > 0) {
      setCurrentSong((isShuffle ? shuffledQueue : songQueue)[currentIndex - 1]);
      setIsPlaying(true);
    }
  };

  // Handle next song
  const handleNext = () => {
    const currentIndex = (isShuffle ? shuffledQueue : songQueue).findIndex(song => song._id === currentSong._id);
    if (currentIndex < (isShuffle ? shuffledQueue : songQueue).length - 1) {
      setCurrentSong((isShuffle ? shuffledQueue : songQueue)[currentIndex + 1]);
      setIsPlaying(true);
    } else if (repeatMode === 1) {
      setCurrentSong((isShuffle ? shuffledQueue : songQueue)[0]);
      setIsPlaying(true);
    }
  };

  const handleShuffleToggle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle) {
      const shuffled = [...songQueue].sort(() => Math.random() - 0.5);
      setShuffledQueue(shuffled);
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
          src={`http://localhost:5000/${currentSong.imagePath}` || "/placeholder.png"}
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
            {repeatMode === 2 ? (
              <>
                <FaRedoAlt className="transition-colors duration-300" />
                <span className="absolute top-0 right-0 text-xs text-white">1</span>
              </>
            ) : (
              <FaSyncAlt className="transition-colors duration-300" />
            )}
          </button>

          <button
          onClick={() => setShowQueue(!showQueue)}
          className="text-2xl p-4 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-xl transform transition-transform hover:scale-125 hover:text-white ml-2"
        >
          <FaListUl />
        </button>
        </div>

        <div className="flex items-center w-full justify-center">
          <span className="text-blue-800 mr-2">{formatTime(currentTime)}</span>
          <div className="relative w-3/4 mx-2">
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              style={{ background: 'linear-gradient(to right, #4caf50, #2196f3, #ff5722)' }}
            />
            <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-lg" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
          </div>
          <span className="text-blue-800 ml-2">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center">
        <button onClick={toggleMute} className="text-2xl p-4 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-xl transform transition-transform hover:scale-125 hover:text-white mr-2">
          {isMuted ? <FaVolumeMute className="transition-colors duration-300" /> : <FaVolumeUp className="transition-colors duration-300" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={changeVolume}
          className="w-24 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          style={{ background: 'linear-gradient(to right, #d3d3d3, #a9a9a9, #696969)' }}
        />
      </div>
      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 bottom-0 right-0 w-82 shadow-xl bg-gradient-to-l from-blue-100 to-blue-600 p-4 overflow-y-auto"
          >
            <h3 className="text-4xl font-bold text-white mb-3">Playlist</h3>
            <ul>
              {songQueue.map((song, index) => (
                <li
                  key={song._id}
                  className={`p-2 text-lg ${
                    currentSong._id === song._id ? "font-bold bg-opacity-0 bg-white rounded-lg mt-2 text-white text-xl" : ""
                  } hover:bg-opacity-30 cursor-pointer`}
                  onClick={() => setCurrentSong(song)}
                >
                  {index + 1}. {song.name} - {song.artist}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
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