import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DayViewSlider from "./DayViewSlider";

const Calendar = ({ daysWithSongs }) => {
  const [view, setView] = useState("day"); // 'day', 'month', or 'year'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // Tracks the selected day
  const [songsForSelectedDay, setSongsForSelectedDay] = useState([]); // Songs fetched from the API

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthsOfYear = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  // API Call: Fetch songs for the selected day
  const fetchSongsForDay = async (day) => {
    try {
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      const response = await fetch(`http://localhost:5000/api/songs/getSongs?date=${formattedDate}`);
      const data = await response.json();
      setSongsForSelectedDay(data); // Only songs for the selected day
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };
  
  

  const handleDayClick = (day) => {
    setSelectedDay(day);
    fetchSongsForDay(day); // Fetch songs when a day is clicked
  };

  const goBack = () => setView((prev) => (prev === "day" ? "month" : "year"));
  const goToYear = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setView("month");
  };
  const goToMonth = (month) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setView("day");
  };

  const renderDayView = () => {
    const days = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysArray = [...Array(firstDay).fill(null), ...Array(days).fill().map((_, i) => i + 1)];

    return (
      <motion.div
        key="day"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mt-32">
          <div className="grid grid-cols-7 text-2xl font-bold mb-8">
            {daysOfWeek.map((day, i) => (
              <div
                key={day}
                className={`text-center ${i === 0 ? "text-red" : i === 6 ? "text-[#51EEFC]" : "text-white"}`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-6">
            {daysArray.map((day, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center relative h-16 w-16 text-white mx-auto cursor-pointer"
                onClick={() => day && handleDayClick(day)} // Fetch songs for the clicked day
              >
                {day && (
                  <>
                    {daysWithSongs.includes(day) && (
                      <div className="absolute h-12 w-12 border-2 border-white rounded-full opacity-30"></div>
                    )}
                    <span className={`text-2xl font-semibold ${idx % 7 === 0 ? "text-red" : idx % 7 === 6 ? "text-[#51EEFC]" : ""}`}>{day}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderMonthView = () => (
    <motion.div
      key="month"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mt-32"
    >
      <div className="grid grid-cols-3 gap-6">
        {monthsOfYear.map((month, idx) => (
          <div
            key={month}
            onClick={() => goToMonth(idx)}
            className="cursor-pointer text-center text-5xl font-bold text-white hover:text-gray-300"
          >
            {month}
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderYearView = () => (
    <motion.div
      key="year"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mt-48"
    >
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 13 }, (_, i) => 2020 + i).map((year) => (
          <div
            key={year}
            onClick={() => goToYear(year)}
            className="cursor-pointer text-center text-5xl font-bold text-white hover:text-gray-300"
          >
            {year}
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#51EEFC] to-[#0015FF] text-white font-['Inter'] p-8 relative">
      <div className="flex items-center mb-6 relative z-10">
        {view !== "year" && !selectedDay && (
          <button onClick={goBack} className="text-4xl font-bold hover:text-gray-300 z-20">
            ←
          </button>
        )}

        {!selectedDay && <h1 className="text-7xl italic font-bold absolute top-8 left-8 z-10">CALENDAR</h1>}
      </div>

      <div
        className="absolute top-8 right-10 text-[500px] font-bold text-blackBlue opacity-20 select-none z-0"
        style={{ pointerEvents: "none" }}
      >
        {view === "day"
          ? currentDate.getMonth() + 1
          : view === "month"
          ? currentDate.getFullYear()
          : "YEAR"}
      </div>

      <AnimatePresence mode="wait">
        {view === "day" && renderDayView()}
        {view === "month" && renderMonthView()}
        {view === "year" && renderYearView()}
      </AnimatePresence>

      <AnimatePresence>
  {selectedDay && (
    <DayViewSlider
      key="slider"
      selectedDay={selectedDay}
      currentDate={currentDate} // Pass the currentDate prop here
      songs={songsForSelectedDay}
      onClose={() => setSelectedDay(null)}
      onEdit={() => {}}
      onDelete={() => {}}
      onAdd={() => {}}
    />
  )}
</AnimatePresence>

    </div>
  );
};

export default Calendar;
