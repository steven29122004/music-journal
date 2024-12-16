const express = require("express");
const multer = require("multer");
const Song = require("../models/Song");
const router = express.Router();

// Configure storage for uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Validate file type and size
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Validate file type
    const allowedTypes = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/m4a"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only audio files are allowed!"));
    }

    // Allow the file if it passes validation
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
});

// Add a song with file validation
router.post("/addSong", upload.single("file"), async (req, res) => {
  try {
    console.log("File Path:", req.file.path); // Debugging to check file path
    const { name, artist, mood, tags, journal } = req.body;

    const song = new Song({
      name,
      artist,
      mood,
      tags: tags.split(","),
      journal,
      filePath: req.file.path.replace(/\\/g, "/"), // Ensure forward slashes
    });

    await song.save();
    res.status(201).json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get songs
router.get("/getSongs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit songs
router.put("/editSong/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const song = await Song.findByIdAndUpdate(id, updatedData, { new: true });
      if (!song) return res.status(404).json({ message: "Song not found" });
      res.status(200).json(song);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Delete songs
const fs = require("fs");
router.delete("/deleteSong/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findByIdAndDelete(id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    // Remove the file from the server
    if (song.filePath) {
      fs.unlink(song.filePath, (err) => {
        if (err) console.error("Error deleting file:", err.message);
      });
    }

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Filter Songs
router.get("/filterSongs", async (req, res) => {
    const { mood, tags, startDate, endDate } = req.query;
  
    const query = {};
    if (mood) query.mood = mood;
    if (tags) query.tags = { $in: tags.split(",") }; // Match any of the tags
    if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  
    try {
      const songs = await Song.find(query);
      res.status(200).json(songs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  
// Create playlist according to metadata
router.get("/createPlaylist", async (req, res) => {
    const { mood, tags, startDate, endDate } = req.query;
  
    const query = {};
    if (mood) query.mood = mood;
    if (tags) query.tags = { $in: tags.split(",") };
    if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  
    try {
      const playlist = await Song.find(query);
      res.status(200).json(playlist);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  

module.exports = router;
