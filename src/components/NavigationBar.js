import React from "react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <nav className="bg-white text-blue-400 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">Music Journal</div>
        <ul className="flex space-x-4 text-xl">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/playlist" className="hover:underline">Playlist</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
