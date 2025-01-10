import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SongModal = ({ songData, onClose, onSave }) => {
  const moodOptions = ["Happy", "Sad", "Energetic", "Calm"];
  const tagOptions = ["Workout", "Relax", "Party", "Study"];

  const [formData, setFormData] = useState({
    ...songData,
    date: songData.date || "", // Ensure the selected date is retained
    file: null,
    image: null, // New field for image upload
  });

  const [previewImage, setPreviewImage] = useState(
    songData.imagePath ? `http://localhost:5000/${songData.imagePath}` : "/placeholder.png"
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else if (name === "image") {
      setFormData({ ...formData, image: files[0] });
      if (files[0]) {
        setPreviewImage(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("artist", formData.artist);
    formDataToSend.append("mood", formData.mood);
    formDataToSend.append("tags", formData.tags);
    formDataToSend.append("journal", formData.journal);
    formDataToSend.append("date", formData.date);
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const endpoint = formData._id
        ? `http://localhost:5000/api/songs/editSong/${formData._id}`
        : "http://localhost:5000/api/songs/addSong";

      const method = formData._id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) throw new Error(`Failed to ${formData._id ? "edit" : "add"} song`);

      const updatedSong = await response.json();
      onSave(updatedSong); // Notify parent to refresh songs
    } catch (error) {
      console.error(`Error ${formData._id ? "editing" : "saving"} song:`, error.message);
    }
  };

  return (
    <motion.div
      key="day"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
        style={{ pointerEvents: "all" }}
      >
        <div className="relative bg-white text-black p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-3xl font-bold mb-6">{songData.name ? "Edit Song" : "Add Song"}</h2>

          {/* Input Fields */}
          <label className="block mb-2">Name</label>
          <input
            className="w-full p-2 border mb-4"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />

          <label className="block mb-2">Artist</label>
          <input
            className="w-full p-2 border mb-4"
            name="artist"
            value={formData.artist || ""}
            onChange={handleChange}
          />

          <label className="block mb-2">Mood</label>
          <select
            className="w-full p-2 border mb-4"
            name="mood"
            value={formData.mood || ""}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Mood
            </option>
            {moodOptions.map((mood) => (
              <option key={mood} value={mood}>
                {mood}
              </option>
            ))}
          </select>

          <label className="block mb-2">Tags</label>
          <select
            className="w-full p-2 border mb-4"
            name="tags"
            value={formData.tags || ""}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Tag
            </option>
            {tagOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <label className="block mb-2">Journal</label>
          <textarea
            className="w-full p-2 border mb-4"
            name="journal"
            rows="3"
            value={formData.journal || ""}
            onChange={handleChange}
          ></textarea>

          <label className="block mb-2">Upload MP3 File</label>
          <input
            className="w-full p-2 border mb-4"
            type="file"
            name="file"
            onChange={handleChange}
          />

          <label className="block mb-2">Upload Image</label>
          <input
            className="w-full p-2 border mb-4"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <img
            src={previewImage}
            alt="Preview"
            className="w-32 h-32 object-cover rounded mb-4"
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SongModal;
