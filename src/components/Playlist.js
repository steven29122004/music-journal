import React, { useState } from "react";
import MusicPlayer from "./MusicPlayer";

const Playlist = () => {
  const [filters, setFilters] = useState({ mood: "", tags: "", startDate: "", endDate: "" });
  const [playlist, setPlaylist] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchPlaylist = async () => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`http://localhost:5000/api/songs/filterSongs?${query}`);
    const data = await response.json();
    setPlaylist(data);
  };

  return (
    <div>
      <h2>Playlist Creator</h2>
      <div>
        <input name="mood" placeholder="Mood" onChange={handleChange} />
        <input name="tags" placeholder="Tags (comma-separated)" onChange={handleChange} />
        <input name="startDate" type="date" onChange={handleChange} />
        <input name="endDate" type="date" onChange={handleChange} />
        <button onClick={fetchPlaylist}>Generate Playlist</button>
      </div>
      <ul>
        {playlist.map((song) => (
          <li key={song._id}>
            {song.name} by {song.artist}
            <MusicPlayer filePath={`http://localhost:5000/${song.filePath}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
