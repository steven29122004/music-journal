import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SongModal from "./SongModal";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const DayViewSlider = ({ selectedDay, songs, onClose, onAdd, currentDate, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [localSongs, setLocalSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch songs for the selected day whenever the day changes
  useEffect(() => {
    const fetchSongsForDay = async () => {
      setLoading(true);
      setError("");
      if (!selectedDay) return;

      // Format the selected date
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${selectedDay.toString().padStart(2, "0")}`;

      try {
        const response = await fetch(
          `http://localhost:5000/api/songs/getSongs?date=${formattedDate}&mood=${selectedMood}&tags=${selectedTags.join(",")}`
        );
        if (!response.ok) throw new Error("Failed to fetch songs.");
        const data = await response.json();
        setLocalSongs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSongsForDay();
  }, [selectedDay, currentDate, selectedMood, selectedTags]);

  // Function to open Add Song Modal
  const openAddModal = () => {
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${selectedDay.toString().padStart(2, "0")}`;

    setModalData({
      name: "",
      artist: "",
      mood: "",
      tags: "",
      journal: "",
      file: null,
      date: formattedDate, // Use the selected date
    });
    setIsModalOpen(true);
  };

  // Function to open Edit Song Modal
  const openEditModal = (song) => {
    setModalData(song);
    setIsModalOpen(true);
  };

  // Function to handle Delete Song functionality
  const handleDeleteSong = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/songs/deleteSong/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete song");

      setLocalSongs((prevSongs) => prevSongs.filter((song) => song._id !== id)); // Update local state
      onDelete(id); // Notify parent to remove the song
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  // Navigate to the player page with only the selected song (no playlist)
  const handlePlaySong = (song) => {
    navigate("/player", { state: { song, playlist: [] } });
  };

  return (
    <motion.div
      initial={{ x: "-100%" }} // Start off-screen to the left
      animate={{ x: 0 }}       // Slide into view
      exit={{ x: "-100%" }}    // Slide back to the left
      transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth animation
      className="fixed top-0 left-0 w-1/2 h-full bg-[#00153E] text-white p-8 shadow-lg z-40"
    >
      {/* Close Button */}
      <button onClick={onClose} className="text-2xl font-bold mb-6 hover:text-gray-300">
        ← Close
      </button>

      {/* Header */}
      <h2 className="text-5xl italic font-bold mb-6">Day {selectedDay}</h2>

      {/* Song List */}
      {localSongs.length > 0 ? (
        localSongs.map((song, idx) => (
          <div key={idx} className="mb-6 border-b pb-4">
            <h3 className="text-3xl font-bold">{song.name}</h3>
            <p className="text-lg italic">Artist: {song.artist}</p>
            <p>Mood: {song.mood} | Tags: {song.tags}</p>
            <p className="mt-2 text-gray-300 italic">Journal: {song.journal}</p>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-4">
              <button className="text-blue-400" onClick={() => openEditModal(song)}>
                Edit
              </button>
              <button className="text-red" onClick={() => handleDeleteSong(song._id)}>
                Delete
              </button>
              <button className="text-green-400" onClick={() => handlePlaySong(song)}>
                Play
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-300 text-xl">No songs available for this day.</p>
      )}

      {/* Add Song Button */}
      <button onClick={openAddModal} className="text-2xl text-blue-400 mt-6 hover:underline">
        + Add Song
      </button>

      {/* Add/Edit Song Modal */}
      {isModalOpen && (
        <SongModal
          songData={modalData}
          onClose={() => setIsModalOpen(false)}
          onSave={(updatedSong) => {
            if (modalData._id) {
              // Update existing song in local state
              setLocalSongs((prevSongs) =>
                prevSongs.map((song) => (song._id === updatedSong._id ? updatedSong : song))
              );
              onEdit(updatedSong);
            } else {
              // Add new song to local state
              setLocalSongs((prevSongs) => [...prevSongs, updatedSong]);
              onAdd(updatedSong);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </motion.div>
  );
};

DayViewSlider.propTypes = {
  selectedDay: PropTypes.number.isRequired,
  songs: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    mood: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    journal: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DayViewSlider;