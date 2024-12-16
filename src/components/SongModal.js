import React, { useState } from "react";

const SongModal = ({ isOpen, onClose, onSave, song }) => {
    const [formData, setFormData] = useState({
      name: song?.name || "",
      artist: song?.artist || "",
      mood: song?.mood || "",
      tags: song?.tags?.join(", ") || "",
      journal: song?.journal || "",
      file: null,
    });
  
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormData({
        ...formData,
        [name]: files ? files[0] : value, // Handle file input separately
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const form = new FormData();
      form.append("name", formData.name);
      form.append("artist", formData.artist);
      form.append("mood", formData.mood);
      form.append("tags", formData.tags);
      form.append("journal", formData.journal);
      if (formData.file) form.append("file", formData.file);
  
      await onSave(form); // Send data to the backend
      onClose();
    };
  
    return isOpen ? (
      <div className="modal">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h2>{song ? "Edit Song" : "Add Song"}</h2>
          <input name="name" placeholder="Song Name" value={formData.name} onChange={handleChange} required />
          <input name="artist" placeholder="Artist" value={formData.artist} onChange={handleChange} required />
          <input name="mood" placeholder="Mood" value={formData.mood} onChange={handleChange} required />
          <input name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} required />
          <textarea name="journal" placeholder="Journal Entry" value={formData.journal} onChange={handleChange} required />
          <input type="file" name="file" accept="audio/*" onChange={handleChange} required={!song} />
          <button type="submit">{song ? "Save Changes" : "Add Song"}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    ) : null;
  };
  
  export default SongModal;