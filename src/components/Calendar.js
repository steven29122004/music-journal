import React, { useState } from "react";

const Calendar = ({ daysWithSongs }) => {
  const [view, setView] = useState("day"); // 'day', 'month', or 'year'
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthsOfYear = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const getDaysInMonth = () => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

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
    const days = getDaysInMonth();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysArray = [...Array(firstDay).fill(null), ...Array(days).fill().map((_, i) => i + 1)];

    return (
      <div className="mt-32">
        {/* Days of the Week */}
        <div className="grid grid-cols-7 text-2xl font-bold mb-8">
          {daysOfWeek.map((day, i) => (
            <div
              key={day}
              className={`text-center ${
                i === 0 ? "text-red-500" : i === 6 ? "text-[#51EEFC]" : "text-white"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-y-6">
          {daysArray.map((day, idx) => (
            <div key={idx} className="flex items-center justify-center relative h-16 w-16 text-white mx-auto">
              {day && (
                <>
                  {/* Transparent Circle for Days with Songs */}
                  {daysWithSongs.includes(day) && (
                    <div className="absolute h-14 w-14 border-2 border-white rounded-full opacity-30"></div>
                  )}
                  <span
                    className={`text-2xl font-semibold ${
                      (idx % 7) === 0 ? "text-red-500" : (idx % 7) === 6 ? "text-[#51EEFC]" : ""
                    }`}
                  >
                    {day}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => (
    <div className="grid grid-cols-3 gap-6 mt-12">
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
  );

  const renderYearView = () => {
    const years = Array.from({ length: 13 }, (_, i) => 2020 + i);
    return (
      <div className="grid grid-cols-4 gap-6 mt-12">
        {years.map((year) => (
          <div
            key={year}
            onClick={() => goToYear(year)}
            className="cursor-pointer text-center text-4xl font-bold text-white hover:text-gray-300"
          >
            {year}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#51EEFC] to-[#0015FF] text-white font-['Inter'] p-8 relative">
      {/* Header */}
      <div className="flex items-center mb-6 relative z-10">
        {view !== "year" && (
          <button onClick={goBack} className="text-4xl font-bold hover:text-gray-300 z-20">
            ←
          </button>
        )}
        <h1 className="text-6xl italic font-bold absolute top-8 left-8 z-10">CALENDAR</h1>
      </div>

      {/* Big Month/Year Number (background layer) */}
      <div
        className="absolute top-8 right-10 text-[500px] font-bold text-blackBlue opacity-30 select-none z-0"
        style={{ pointerEvents: "none" }}
      >
        {view === "day"
          ? currentDate.getMonth() + 1
          : view === "month"
          ? currentDate.getFullYear()
          : "YEAR"}
      </div>

      {/* Calendar View */}
      {view === "day" && renderDayView()}
      {view === "month" && renderMonthView()}
      {view === "year" && renderYearView()}
    </div>
  );
};

export default Calendar;
