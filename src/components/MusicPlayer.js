import React, { useState, useEffect } from "react";
import { Howl } from "howler";

const MusicPlayer = ({ filePath }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default volume: 50%
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sound, setSound] = useState(null);

  // Play or pause the song
  const togglePlay = () => {
    if (!sound) {
      const newSound = new Howl({
        src: [filePath],
        html5: true,
        volume,
        onplay: () => setDuration(newSound.duration()),
        onend: () => {
          setIsPlaying(false);
          setCurrentTime(0);
        },
      });
      setSound(newSound);
      newSound.play();
      setIsPlaying(true);
    } else if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
    } else {
      sound.play();
      setIsPlaying(true);
    }
  };

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
    if (sound) sound.volume(newVolume);
  };

  // Seek to a specific position
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (sound) sound.seek(seekTime);
  };

  return (
    <div>
      <h2>Music Player</h2>
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <div>
        <label>Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={changeVolume}
        />
      </div>
      <div>
        <label>Seek:</label>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
        />
        <span>
          {Math.round(currentTime)} / {Math.round(duration)} sec
        </span>
      </div>
    </div>
  );
};

export default MusicPlayer;
