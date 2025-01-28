"use client";
import React from 'react';
import { Clock, Users, FileText } from 'lucide-react';
import events from './eventdata';

const EventView = ({ selectedDate, changeWork }) => {
  // Filter events for the selected date
  const dayEvents = events.filter(event => 
    new Date(event.date).toDateString() === selectedDate.toDateString()
  ).sort((a, b) => {
    const timeA = new Date(`1970/01/01 ${a.start}`);
    const timeB = new Date(`1970/01/01 ${b.start}`);
    return timeA - timeB;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-300 border-s-2 border-gray-600">
      <div className="max-w-4xl px-3 py-8">
        <div className="flex justify-center mb-12">
          <div className="text-center">
            <h2 className="text-3xl text-center font-bold tracking-tight">
              Events              
            </h2>
            <p className="text-gray-400 mt-2">{selectedDate.toDateString()}</p>
          </div>
          <button 
            onClick={changeWork}
            className="hover:bg-gray-800 p-2 rounded-full transition-colors z-10 absolute right-80 top-12"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {dayEvents.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-xl">No events scheduled for this day</p>
          </div>
        ) : (
          <div className="space-y-4 h-[71vh] overflow-y-auto overflow-x-hidden scrollbar-none px-3 py-2">
            {dayEvents.map((event) => (
              <div 
                key={event.id}
                className={` 
                  border-l-4 ${event.color}
                  p-3 rounded-lg shadow-lg 
                  transform transition-all 
                  hover:scale-[1.02] hover:shadow-xl
                  flex items-start space-x-4
                `}
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-200">{event.title}</h3>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{event.start} - {event.end}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{event.participants}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>{event.description}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventView;