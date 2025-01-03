import React, { useEffect, useState } from "react";
import SongModal from "./SongModal";

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  // Fetch songs
  const fetchSongs = async () => {
    const response = await fetch("http://localhost:5000/api/songs/getSongs");
    const data = await response.json();
    setSongs(data);
  };

  // Add or edit a song
  const handleSave = async (formData) => {
    const method = selectedSong ? "PUT" : "POST";
    const url = selectedSong
      ? `http://localhost:5000/api/songs/editSong/${selectedSong._id}`
      : "http://localhost:5000/api/songs/addSong";

    await fetch(url, {
      method,
      body: formData,
    });

    fetchSongs();
    setSelectedSong(null);
  };

  // Delete a song
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/songs/deleteSong/${id}`, { method: "DELETE" });
    fetchSongs();
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div>
      <h2>Song List</h2>
      <button onClick={() => setIsModalOpen(true)}>Add New Song</button>
      <ul>
        {songs.map((song) => (
          <li key={song._id}>
            {song.name} by {song.artist}
            <button onClick={() => { setSelectedSong(song); setIsModalOpen(true); }}>Edit</button>
            <button onClick={() => handleDelete(song._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <SongModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedSong(null); }}
        onSave={handleSave}
        song={selectedSong}
      />
    </div>
  );
};

export default SongList;
