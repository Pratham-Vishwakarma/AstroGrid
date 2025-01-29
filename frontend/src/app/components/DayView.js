"use client";
import React, { useState, useMemo, useEffect } from 'react';
import events from '../data/eventdata';
import Navbar from './Navbar';
import todos from '../data/tododata';

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

    const dayTodos = todos.filter(todo => 
      new Date(todo.date).toDateString() === currentDate.toDateString()
  );

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
      const allItems = [
          ...dayEvents.map(event => ({
              ...event,
              isTodo: false,
              start: event.start,
              end: event.end
          })),
          ...dayTodos.map(todo => ({
              ...todo,
              isTodo: true,
              start: todo.time.split(' - ')[0],
              end: todo.time.split(' - ')[1]
          }))
      ];
  
      if (allItems.length === 0) return [];
    
      const sortedItems = [...allItems].sort((a, b) =>
          timeToMinutes(a.start) - timeToMinutes(b.start)
      );
    
      sortedItems.forEach((item) => {
          const itemStart = timeToMinutes(item.start);
          const itemEnd = timeToMinutes(item.end);
      
          const overlaps = sortedItems.filter(existingItem => {
              const existingStart = timeToMinutes(existingItem.start);
              const existingEnd = timeToMinutes(existingItem.end);
              return !(itemEnd <= existingStart || itemStart >= existingEnd);
          });
      
          item.totalOverlaps = overlaps.length;
          item.column = overlaps.findIndex(e => e === item);
      });
    
      return sortedItems;
  };    
  
  // Then replace processedItems with:
  const processedItems = findEventColumns();

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
                
            {processedItems.map(item => (
              <div
                key={`${item.isTodo ? 't' : 'e'}-${item.id || item.title}-${currentDate.toDateString()}-${item.time}`} // Unique key with 't' for todo and 'e' for event
                className={`
                  absolute
                  ${item.color} 
                  text-gray-200 
                  rounded-lg 
                  shadow-lg 
                  p-1 
                  border-2 
                  ${item.isTodo ? 'border-dashed border-gray-400 hover:border-white' : 'border-gray-900'}
                  ${item.isTodo && item.status === 'Complete' ? 'opacity-50' : 'opacity-90'}
                  transition-all duration-200 ease-in-out
                  hover:scale-[1.01]
              `}
                style={{
                  top: `${calculateEventPosition(item.start)}%`,
                  height: `calc(${calculateEventHeight(item.start, item.end)}% - 0.5px)`,
                  width: item.totalOverlaps === 1
                    ? `calc(${(1 / item.totalOverlaps) * 100}% - 81px)` //No Overlaps
                    : `calc(${(1 / item.totalOverlaps) * 100}% - (${(80 / item.totalOverlaps)}px + 1px))`, //Overlaps
                  left: item.totalOverlaps === 1
                    ? `calc(${(item.column / item.totalOverlaps) * 100}% + 81px)`
                    : `calc(${(item.column / item.totalOverlaps) * 100}% - ${(80 / item.totalOverlaps) * item.column}px + 81px)`,
                    opacity: item.isTodo ? (item.status === 'Complete' ? 0.4 : 0.7) : 0.9,
                }}
              >
                <div className="flex justify-between items-start">
                  <div className={`${item.totalOverlaps === 1 ? 'space-x-2 flex items-center' : ''}`}>
                    <h3 className="font-semibold text-sm">
                      {item.isTodo ? '📝 ' : ''}{item.title}
                    </h3>
                    <p className="text-xs opacity-75">
                      {(item.start || item.time).replace(/\s[APap][Mm]/, '')} - 
                      {(item.end || item.time.split(' - ')[1]).replace(/\s[APap][Mm]/, '')}
                    </p>
                  </div>
                  <span className="bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs">
                    {item.isTodo ? 
                      (item.status === 'Complete' ? '✅' : '⏳') :
                      `${item.participants} 👥`
                    }
                  </span>
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