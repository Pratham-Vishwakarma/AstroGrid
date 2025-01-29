"use client";
import React, { useState } from 'react';
import DayView from './DayView';
import EventView from './EventView';
import events from '../data/eventdata';
import SideBar from './SideBar';
import Navbar from './Navbar';
import WeekView from './WeekView';
import TodoView from './TodoView';
import Help from './Help';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('calendar');
  const [work, setWork] = useState('events');
  const [help, setHelp] = useState('nohelp');

  const handleDayClick = (date) => {
    setSelectedDate(date); // Update the selected date
    setView('day'); // Switch to the DayView
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(), 
    currentDate.getMonth() + 1, 
    0
  ).getDate();

  const daysInPrevMonth = new Date(
    currentDate.getFullYear(), 
    currentDate.getMonth(), 
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(), 
    currentDate.getMonth(), 
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalSlots = daysInMonth + firstDayOfMonth;
    const totalRows = Math.ceil(totalSlots / 7);

    let dayCounter = 1;
    let prevMonthDayCounter = daysInPrevMonth - firstDayOfMonth + 1;
    let nextMonthDayCounter = 1;

    for (let i = 0; i < totalRows * 7; i++) {
      let dayToRender;
      let isCurrentMonth = false;
      let currentDay;

      if (i < firstDayOfMonth) {
        // Previous month days
        dayToRender = prevMonthDayCounter;
        currentDay = new Date(
          currentDate.getFullYear(), 
          currentDate.getMonth() - 1, 
          dayToRender
        );
        prevMonthDayCounter++;
      } else if (dayCounter <= daysInMonth) {
        // Current month days
        dayToRender = dayCounter;
        isCurrentMonth = true;
        currentDay = new Date(
          currentDate.getFullYear(), 
          currentDate.getMonth(), 
          dayCounter
        );
        dayCounter++;
      } else {
        // Next month days
        dayToRender = nextMonthDayCounter;
        currentDay = new Date(
          currentDate.getFullYear(), 
          currentDate.getMonth() + 1, 
          dayToRender
        );
        nextMonthDayCounter++;
      }

      const isToday = currentDay.toDateString() === new Date().toDateString();
      const isSelected = currentDay.toDateString() === selectedDate.toDateString();
      const dayEvents = getEventsForDate(currentDay);

      days.push(
        <button
          key={`day-${i}`}
          onClick={() => {
            setSelectedDate(currentDay);
          }}
          onDoubleClick={() => {
            setView('day');
          }}
          
          className={`
            flex flex-col font-semibold
            h-16 border-2 border-opacity-40 border-gray-600 
            transition-all duration-200 ease-in-out
            ${!isCurrentMonth ? 'text-gray-600 opacity-50' : `${!isToday && !isSelected ? 'bg-gray-900 bg-opacity-60' : ''}`}
            ${isToday ? 'ring-2 ring-blue-500 text-blue-400 bg-blue-800' : ''}            
            ${isSelected && !isToday ? 'bg-blue-900 text-white ring-1 ring-blue-300 bg-opacity-40' : 'hover:bg-gray-800'}
            text-gray-200 rounded-lg p-2
          `}
        >
          <div className="w-full flex justify-between items-center">
            <span>{dayToRender}</span>
            {dayEvents.length > 0 && (
              <div className="grid grid-cols-5 gap-1 md:grid-cols-4 sm:grid-cols-3">
                {dayEvents.map(event => (
                  <span 
                    key={event.id} 
                    className={`w-1.5 h-1.5 rounded-full ${event.color}`}
                  />
                ))}
              </div>
            )}
          </div>
        </button>
      );
    }

    return days;
  };

  return (
    <>
      <div className="flex overflow-hidden">
        <SideBar setCalender={() => setView('calendar')} setDay={() => setView('day')} setWeek={()=>setView('week')} setHelp={() => setHelp('help')}/>
        <div className="w-2/3">
          {view === 'calendar' && (
            <>
              <Navbar 
                currentView={view}
                currentDate={currentDate}
                selectedDate={selectedDate}
                onChangeMonth={changeMonth}
                monthNames={monthNames}
              />
              <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-200 p-4 space-y-4">
                <div className='h-14'></div>              
                <div className="grid grid-cols-7 text-center font-semibold text-gray-400 ml-12">
                  {weekdays.map(day => (
                    <div key={day} className="p-2">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 flex-1 ml-12">
                  {renderCalendarDays()}
                </div>
              </div>
            </>
          )}

          {view === 'day' && (
            <div className='bg-gradient-to-br from-black via-gray-900 to-black text-gray-200'>
              <DayView selectedDate={selectedDate} onBack={() => setView('calendar')} view={view} />
            </div>
          )}

          {view === 'week' && (
            <div className='bg-gradient-to-br from-black via-gray-900 to-black text-gray-200'>
              <WeekView selectedDate={selectedDate} onBack={() => setView('calendar')} onDay={handleDayClick} view={view} />
            </div>
          )}

        </div>

        <div className='w-1/3 h-screen'>
          {work === 'events' && (
            <EventView selectedDate={selectedDate} changeWork={() => setWork('todo')}/>
          )}
          {work === 'todo' && (
            <div>
              <TodoView selectedDate={selectedDate} changeWork={() => setWork('events')}/>
            </div>
          )}
        </div>
        
        {help === 'help' && (
            <Help setBack={() => setHelp('nohelp')} />
        )}

      </div>
    </>
  );
};

export default Calendar;