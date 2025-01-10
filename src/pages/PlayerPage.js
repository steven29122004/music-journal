import React from "react";
import { usePlayer } from "../context/PlayerContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";

const PlayerPage = () => {
  const { currentSong, isPlayerExpanded, setIsPlayerExpanded } = usePlayer();

  if (!currentSong) return null;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-blue-500 to-blue-900 text-white shadow-lg"
      initial={{ y: "100%" }}
      animate={{ y: isPlayerExpanded ? "0%" : "83%" }} // When collapsed, 90% remains visible
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      style={{ height: "100%" }} // Adjust to leave space for the bottom player
    >
      {/* Toggle Buttons */}
      {isPlayerExpanded ? (
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => setIsPlayerExpanded(false)}
        >
          <FaChevronDown className="text-2xl" />
        </div>
      ) : (
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => setIsPlayerExpanded(true)}
        >
          <FaChevronUp className="text-2xl" />
        </div>
      )}

      {/* Song Details */}
      <div className="flex flex-col items-center justify-center h-full">
        <img
          src={`http://localhost:5000/${currentSong.imagePath}` || "/placeholder.png"}
          alt="Song"
          className="w-64 h-64 object-cover rounded-lg mb-4"
        />
          <h1 className="text-5xl font-bold mb-2">{currentSong.name}</h1>
      <h2 className="text-3xl font-semibold text-gray-300 mb-2">{currentSong.artist}</h2>
      <p className="text-xl font-semilight italic text-gray-400 mb-1">Mood: {currentSong.mood}</p>
      <p className="text-xl font-semilight italic text-gray-400 mb-1">Tags: {currentSong.tags?.join(", ")}</p>
      <p className="text-2xl font-light text-gray-400 text-center max-w-lg mt-6">{currentSong.journal}</p>
      </div>
    </motion.div>
  );
};

export default PlayerPage;
