const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  mood: { type: String, required: true },
  tags: { type: [String], required: true },
  journal: { type: String },
  filePath: { type: String, required: true },
  imagePath: { type: String }, // Path to the uploaded image
  date: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Song", songSchema);
