const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const songRoutes = require("./routes/songs"); // Replace with your actual routes file
const path = require("path");
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://s3924462:s3924462@test.abo4prq.mongodb.net/?retryWrites=true&w=majority&appName=Testl", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/songs", songRoutes);

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Example: If uploads folder is in the root directory
console.log("Uploads Directory Path:", path.join(__dirname, "uploads"));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
