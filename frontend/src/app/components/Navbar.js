"use client";
import React from "react";

export default function NavBar({ 
  currentView, 
  currentDate,
  selectedDate,
  onChangeMonth,
  monthNames,
  onDateChange,
  onBack,
  onNavigateWeek,
  weekRange,
  monthYear,
}) {

  const handlePreviousDay = () => {
    if (onDateChange) {
      const previousDay = new Date(currentDate);
      previousDay.setDate(currentDate.getDate() - 1);
      onDateChange(previousDay);
    }
  };

  const handleNextDay = () => {
    if (onDateChange) {
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      onDateChange(nextDay);
    }
  };

  return (
    <div className="flex justify-center">
      <nav className="absolute w-[60%] z-20 bg-gray-800 text-gray-400 bg-opacity-90 shadow-lg flex items-center px-4 py-2 rounded-2xl mt-3">
        <div className="mr-4">
          {/* Darkened Logo */}
          <img
            src="../favicon.ico" // Adjust the path as needed
            alt="Logo"
            className="w-11 h-12 opacity-70"
          />
        </div>
        {currentView === "calendar" && currentDate && selectedDate && (
          <div className="flex justify-end w-full">
            <div className="flex justify-end items-center gap-2">
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <p className="text-gray-400 text-sm">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <button 
                onClick={() => onChangeMonth(-1)}
                className="hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => onChangeMonth(1)}
                className="hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {currentView === "day" && currentDate && (
          <div className="flex justify-between items-center w-full">
            <button 
              onClick={onBack} 
              className="flex items-center space-x-2 hover:bg-gray-800 p-2 rounded-full transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm group-hover:text-blue-400">Back</span>
            </button>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handlePreviousDay}
                className="hover:bg-gray-800 p-2 rounded-full transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">
                  {currentDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h2>
              </div>
              <button 
                onClick={handleNextDay}
                className="hover:bg-gray-800 p-2 rounded-full transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {currentView === 'week' && (
          <>
            <div className="flex justify-end w-full">
              <div className="flex justify-end items-center gap-2">
                <button 
                  onClick={() => onNavigateWeek(-1)}
                  className="hover:bg-gray-800 p-2 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {`${weekRange.start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${weekRange.end.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {`${monthYear}`}
                  </p>
                </div>
                <button 
                  onClick={() => onNavigateWeek(1)}
                  className="hover:bg-gray-800 p-2 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}

      </nav>
    </div>
  );
}