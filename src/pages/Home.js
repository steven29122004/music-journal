import React, { useEffect, useState } from "react";
import Calendar from "../components/Calendar";


const Home = () => {
  const [songs, setSongs] = useState([]); // Initialize as an empty array
  const daysWithSongs = [];

  // Fetch songs on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/songs/getSongs")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data); // Set the fetched songs
      })
      .catch((err) => {
        console.error("Error fetching songs:", err);
        setSongs([]); // Fallback to empty array on error
      });
  }, []);

  return (
    <div>
      <Calendar daysWithSongs={daysWithSongs} />
    </div>
  );
};

export default Home;
