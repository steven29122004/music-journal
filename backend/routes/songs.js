const express = require("express");
const multer = require("multer");
const Song = require("../models/Song");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Configure storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "file") {
      cb(null, "./uploads");
    } else if (file.fieldname === "image") {
      cb(null, "./uploads/image");
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Utility function to delete a file
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${filePath}`, err);
    } else {
      console.log(`File deleted: ${filePath}`);
    }
  });
};


// File type and size validation
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = {
      file: ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/m4a"],
      image: ["image/jpeg", "image/png", "image/gif"],
    };
    if (!allowedTypes[file.fieldname].includes(file.mimetype)) {
      return cb(new Error(`Only ${file.fieldname === "file" ? "audio" : "image"} files are allowed!`));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB for audio, adjust as needed for images
});

// Add a song with file and image validation
router.post(
  "/addSong",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, artist, mood, tags, journal, date } = req.body;

      const song = new Song({
        name,
        artist,
        mood,
        tags: tags.split(","),
        journal,
        filePath: req.files["file"] ? req.files["file"][0].path.replace(/\\/g, "/") : null,
        imagePath: req.files["image"] ? req.files["image"][0].path.replace(/\\/g, "/") : null,
        date: date ? new Date(date) : Date.now(),
      });

      await song.save();
      res.status(201).json(song);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Edit a song
router.put(
  "/editSong/:id",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, artist, mood, tags, journal, date } = req.body;

      const updatedData = {
        name,
        artist,
        mood,
        tags: tags.split(","),
        journal,
        date: new Date(date),
      };

      if (req.files["file"]) {
        updatedData.filePath = req.files["file"][0].path.replace(/\\/g, "/");
      }
      if (req.files["image"]) {
        updatedData.imagePath = req.files["image"][0].path.replace(/\\/g, "/");
      }

      const song = await Song.findByIdAndUpdate(id, updatedData, { new: true });

      if (!song) {
        return res.status(404).json({ error: "Song not found" });
      }

      res.status(200).json(song);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Delete song by ID and associated files
router.delete("/deleteSong/:id", async (req, res) => {
  try {
    const songId = req.params.id;

    // Find the song by ID
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Construct paths for the song file and the image file
    const songFilePath = path.resolve(
      __dirname,
      "../",
      song.filePath.startsWith("uploads/") ? song.filePath : `uploads/${song.filePath}`
    );
    const imageFilePath = song.imagePath
      ? path.resolve(
          __dirname,
          "../",
          song.imagePath.startsWith("uploads/") ? song.imagePath : `uploads/${song.imagePath}`
        )
      : null;

    // Debugging: Log paths
    console.log("Song file path:", songFilePath);
    console.log("Image file path:", imageFilePath);

    // Delete the song file
    deleteFile(songFilePath);

    // Delete the image file if it exists
    if (imageFilePath) {
      deleteFile(imageFilePath);
    }

    // Delete the song from the database
    await Song.findByIdAndDelete(songId);

    res.status(200).json({ message: "Song and associated files deleted successfully" });
  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).json({ error: "An error occurred while deleting the song" });
  }
});

// Get songs
router.get("/getSongs", async (req, res) => {
  try {
    const { date } = req.query;

    const query = {};
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const songs = await Song.find(query);
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Filter songs by mood, tags, and date range
router.get("/filterSongs", async (req, res) => {
  try {
    const { mood, tags, startDate, endDate } = req.query;
   // Build query object
const query = {};

// Mood filter (case-insensitive)
if (mood) {
  query.mood = { $regex: new RegExp(`^${mood}$`, "i") };
}

// Tags filter
if (tags) {
  query.tags = { $in: tags.split(",").map((tag) => tag.trim()) };
}

// Date range filter
if (startDate || endDate) {
  query.date = {};
  if (startDate) {
    query.date.$gte = new Date(startDate).setUTCHours(0, 0, 0, 0);
  }
  if (endDate) {
    query.date.$lte = new Date(endDate).setUTCHours(23, 59, 59, 999);
  }
}

// Log the query
console.log("Filter query:", query);

// Perform database query
const songs = await Song.find(query);

    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
