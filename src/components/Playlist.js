import React, { useState } from "react";
import Select from "react-select";
import { FaPlay, FaPause } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";

const moodOptions = [
  { value: "", label: "No Mood" },
  { value: "happy", label: "Happy" },
  { value: "sad", label: "Sad" },
  { value: "energetic", label: "Energetic" },
  { value: "calm", label: "Calm" },
];

const tagOptions = [
  { value: "", label: "No Tag" },
  { value: "workout", label: "Workout" },
  { value: "relax", label: "Relax" },
  { value: "party", label: "Party" },
  { value: "study", label: "Study" },
];

const Playlist = () => {
  const [filters, setFilters] = useState({ mood: "", tag: "", startDate: "", endDate: "" });
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    setSongQueue,
    setIsPlayerExpanded, // Access setIsPlayerExpanded here
  } = usePlayer();
  const navigate = useNavigate();

  const handleChange = (selectedOption, actionMeta) => {
    setFilters({ ...filters, [actionMeta.name]: selectedOption?.value || "" });
  };

  const fetchPlaylist = async () => {
    setLoading(true);
    setError("");
    try {
      const currentDate = new Date();
      const startDate = filters.startDate ? new Date(filters.startDate) : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const endDate = filters.endDate ? new Date(filters.endDate) : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
  
      // Adjust the end date to the following Friday
      endDate.setDate(endDate.getDate() + (5 - endDate.getDay() + 7) % 7);
  
      const query = new URLSearchParams({
        mood: filters.mood,
        tag: filters.tag,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }).toString();
  
      const response = await fetch(`http://localhost:5000/api/songs/filterSongs?${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch playlist.");
      }
      const data = await response.json();
  
      if (data.length === 0) {
        setError("There are no songs matching the selected filters.");
      }
  
      setPlaylist(data);
      setSongQueue(data); // Set the song queue
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (song) => {
    if (currentSong && currentSong._id === song._id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setIsPlayerExpanded(true); // Expand the player when a new song is played
    }
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen flex flex-col items-center relative">
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
              name="tag"
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
              value={filters.startDate ? new Date(filters.startDate).toISOString().split("T")[0] : ""}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-blue-800 font-bold mb-2">End Date</label>
            <input
              name="endDate"
              type="date"
              value={filters.endDate ? new Date(filters.endDate).toISOString().split("T")[0] : ""}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={fetchPlaylist}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate Playlist"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      {playlist.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">Generated Playlist</h3>
          <ul className="space-y-4">
            {playlist.map((song) => (
              <li
                key={song._id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <div>
                  <p className="text-lg font-bold">{song.name}</p>
                  <p className="text-sm text-gray-600">by {song.artist}</p>
                </div>
                <button
                  className="text-blue-500 text-xl"
                  onClick={() => handlePlayPause(song)}
                >
                  {currentSong && currentSong._id === song._id && isPlaying ? <FaPause /> : <FaPlay />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Playlist;

