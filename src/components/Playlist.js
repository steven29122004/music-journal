import React, { useState } from "react";
import Select from "react-select";
import { FaPlay, FaPause } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";

const moodOptions = [
  { value: "", label: "Select Mood" },
  { value: "happy", label: "Happy" },
  { value: "sad", label: "Sad" },
  { value: "energetic", label: "Energetic" },
  { value: "calm", label: "Calm" },
];

const tagOptions = [
  { value: "", label: "Select Tag" },
  { value: "workout", label: "Workout" },
  { value: "relax", label: "Relax" },
  { value: "party", label: "Party" },
  { value: "study", label: "Study" },
];

const Playlist = () => {
  const [filters, setFilters] = useState({ mood: "", tags: "", startDate: "", endDate: "" });
  const [playlist, setPlaylist] = useState([]);
  const { currentSong, setCurrentSong, isPlaying, setIsPlaying } = usePlayer();

  const handleChange = (selectedOption, actionMeta) => {
    setFilters({ ...filters, [actionMeta.name]: selectedOption.value });
  };

  const fetchPlaylist = async () => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`http://localhost:5000/api/songs/filterSongs?${query}`);
    const data = await response.json();
    setPlaylist(data);
  };

  const handlePlayPause = (song) => {
    if (currentSong && currentSong._id === song._id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Playlist Creator</h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-blue-800 font-bold mb-2">Mood</label>
            <Select
              name="mood"
              options={moodOptions}
              onChange={handleChange}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-blue-800 font-bold mb-2">Tag</label>
            <Select
              name="tags"
              options={tagOptions}
              onChange={handleChange}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-blue-800 font-bold mb-2">Start Date</label>
            <input
              name="startDate"
              type="date"
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-blue-800 font-bold mb-2">End Date</label>
            <input
              name="endDate"
              type="date"
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={fetchPlaylist}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Playlist
        </button>
      </div>
      {playlist.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-2xl">
          <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">Playlist</h3>
          <ul className="space-y-4">
            {playlist.map((song) => (
              <li
                key={song._id}
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer relative group"
                onClick={() => handlePlayPause(song)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold text-blue-800">{song.name}</p>
                    <p className="text-sm text-blue-600">by {song.artist}</p>
                  </div>
                  <button
                    className="text-blue-800 text-2xl absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPause(song);
                    }}
                  >
                    {currentSong && currentSong._id === song._id && isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Playlist;