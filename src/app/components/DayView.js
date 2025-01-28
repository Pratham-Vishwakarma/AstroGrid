"use client";
import React, { useState, useMemo, useEffect } from 'react';
import events from './eventdata';
import Navbar from './Navbar';

const DayView = ({ selectedDate, onBack, view }) => {
    const [currentDate, setCurrentDate] = useState(selectedDate);
    const [now, setNow] = useState(new Date());
    
    // Update time every minute
    useEffect(() => {
      const timer = setInterval(() => {
        setNow(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    const handleDateChange = (date) => {
      setCurrentDate(date);
    };

    const handlePreviousDay = () => {
      const previousDay = new Date(currentDate);
      previousDay.setDate(currentDate.getDate() - 1);
      setCurrentDate(previousDay);
    };

    const handleNextDay = () => {
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      setCurrentDate(nextDay);
    };
  
    // Filter events for the selected date
    const dayEvents = events.filter(event => 
      new Date(event.date).toDateString() === currentDate.toDateString()
    );
  
    const timeSlots = Array.from({length: 24}, (_, i) => 
      `${i % 12 || 12}:00 ${i < 12 ? 'AM' : 'PM'}`
    );
  
    const timeToMinutes = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let adjustedHours = hours;
      
      if (period === 'PM' && hours !== 12) adjustedHours += 12;
      if (period === 'AM' && hours === 12) adjustedHours = 0;
  
      return adjustedHours * 60 + (minutes || 0);
    };
  
    const calculateEventPosition = (start) => {
      const [time, period] = start.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : 
                             period === 'AM' && hours === 12 ? 0 : hours;
      return (adjustedHours * 60 + minutes) / (24 * 60) * 100;
    };
  
    const calculateEventHeight = (start, end) => {
      const startMinutes = timeToMinutes(start);
      const endMinutes = timeToMinutes(end);
      return ((endMinutes - startMinutes) / (24 * 60)) * 100;
    };
  
    const findEventColumns = () => {
      if (dayEvents.length === 0) return [];
    
      const sortedEvents = [...dayEvents].sort((a, b) =>
        timeToMinutes(a.start) - timeToMinutes(b.start)
      );
    
      sortedEvents.forEach((event, index) => {
        const eventStart = timeToMinutes(event.start);
        const eventEnd = timeToMinutes(event.end);
    
        const overlaps = sortedEvents.filter(existingEvent => {
          const existingStart = timeToMinutes(existingEvent.start);
          const existingEnd = timeToMinutes(existingEvent.end);
          return !(eventEnd <= existingStart || eventStart >= existingEnd);
        });
    
        event.totalOverlaps = overlaps.length;
        event.column = overlaps.findIndex(e => e === event);
      });
    
      return sortedEvents;
    };    
  
    const processedEvents = findEventColumns();

    // Calculate current time position and visibility
    const currentTimeIndicator = useMemo(() => {
      const isToday = now.toDateString() === currentDate.toDateString();
      
      if (!isToday) return null;

      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      const totalMinutes = currentHour * 60 + currentMinute;
      const positionPercentage = (totalMinutes / (24 * 60)) * 100;

      return {
        hour: currentHour % 12 || 12,
        minute: currentMinute.toString().padStart(2, '0'),
        second: currentSecond.toString().padStart(2, '0'),
        period: currentHour >= 12 ? 'PM' : 'AM',
        position: positionPercentage
      };
    }, [currentDate, now]);
  
    return (      
      <>
        <Navbar 
          currentView={view} 
          currentDate={currentDate}
          onDateChange={handleDateChange}
          onBack={onBack}
        />
        <div className="max-h-screen pl-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-200 p-6 overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <div className='h-20'></div>
          <div className="relative bg-gray-800 bg-opacity-50 rounded-xl shadow-2xl border border-gray-600 overflow-hidden">
            <div className="absolute left-20 top-0 bottom-0 w-full">
              <div className="h-full border-l border-gray-600"></div>
            </div>
                
            {processedEvents.map(event => (
              <div key={event.id}>
                <div 
                  className={`
                    absolute
                    ${event.color} 
                    text-gray-200 rounded-lg 
                    shadow-lg p-1 border-2 border-gray-900
                  `}
                  style={{
                    top: `${calculateEventPosition(event.start)}%`,
                    height: `calc(${calculateEventHeight(event.start, event.end)}% - 0.5px)`,
                    width: event.totalOverlaps === 1
                      ? `calc(${(1 / event.totalOverlaps) * 100}% - 81px)` //No Overlaps
                      : `calc(${(1 / event.totalOverlaps) * 100}% - (${(80 / event.totalOverlaps)}px + 1px))`, //Overlaps
                    left: event.totalOverlaps === 1
                      ? `calc(${(event.column / event.totalOverlaps) * 100}% + 81px)`
                      : `calc(${(event.column / event.totalOverlaps) * 100}% - ${(80 / event.totalOverlaps) * event.column}px + 81px)`,
                    opacity: 0.9,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className={`${ event.totalOverlaps === 1 ? 'space-x-2 flex items-center' : "" }`}>
                      <h3 className="font-semibold text-sm">{event.title}</h3>
                      <p className="text-xs opacity-75">
                        {event.start.replace(/\s[APap][Mm]/, '')} - {event.end.replace(/\s[APap][Mm]/, '')}
                      </p>
                    </div>
                    <span className="bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs">
                      {event.participants} 👥
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Current Time Indicator */}
            {currentTimeIndicator && (
              <div 
                className="absolute left-20 w-full z-5"
                style={{ top: `${currentTimeIndicator.position}%` }}
              >
                <div className="relative">
                  <div className="h-0.5 bg-gray-400 w-full"></div>
                  <div className="absolute -left-1.5 -top-[5px] w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            )}
      
            {timeSlots.map((time, index) => (
              <div 
                key={time} 
                className={`grid grid-cols-[80px_1fr] ${
                  time === '11:00 PM' ? '' : 'border-b border-gray-600'
                } min-h-[64px]`}
              >
                <div className="text-gray-500 p-2 text-sm self-start">{time}</div>
                <div className="relative"></div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };
  
  export default DayView;