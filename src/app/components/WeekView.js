"use client";
import React, { useState, useMemo, useEffect } from 'react';
import events from './eventdata';
import NavBar from './Navbar';

function WeekView({ selectedDate: initialDate, onBack, onDay, view }) {
    const [currentDate, setCurrentDate] = useState(new Date(initialDate));
    const [now, setNow] = useState(new Date());

    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Compute Week Range
    const weekRange = useMemo(() => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return { start: startOfWeek, end: endOfWeek };
    }, [currentDate]);

    // Compute Month and Year for Display
    const monthYear = useMemo(() => {
        const startMonth = weekRange.start.toLocaleDateString('en-US', { month: 'long' });
        const endMonth = weekRange.end.toLocaleDateString('en-US', { month: 'long' });
        const startYear = weekRange.start.getFullYear();
        const endYear = weekRange.end.getFullYear();
    
        // If the week spans two months
        if (startMonth !== endMonth) {
            // If the months are different, return both months and their respective years
            return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
        } else {
            // If the months are the same, return just the month and the year
            return `${startMonth} ${startYear}`;
        }
    }, [weekRange]);

    const weekDates = useMemo(() => {
        const dates = [];
        const firstDayOfWeek = new Date(currentDate);
        firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        for (let i = 0; i < 7; i++) {
            const date = new Date(firstDayOfWeek);
            date.setDate(firstDayOfWeek.getDate() + i);
            dates.push(date);
        }
        return dates;
    }, [currentDate]);

    const handleDateChange = (date) => {
        setCurrentDate(date);
    };

    const weekEvents = useMemo(() => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return weekDates.some(date => 
                date.toDateString() === eventDate.toDateString()
            );
        });
    }, [weekDates]);

    const timeSlots = Array.from({ length: 24 }, (_, i) => 
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

    const findEventColumns = (dayEvents) => {
        if (dayEvents.length === 0) return [];
      
        const sortedEvents = [...dayEvents].sort((a, b) =>
          timeToMinutes(a.start) - timeToMinutes(b.start)
        );
      
        sortedEvents.forEach(event => {
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

    const currentTimeIndicator = useMemo(() => {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const totalMinutes = currentHour * 60 + currentMinute;
        return (totalMinutes / (24 * 60)) * 100;
    }, [now]);

    return (
        <>
            <NavBar 
                currentView={view}
                onNavigateWeek={navigateWeek}
                onBack={onBack}
                weekRange={weekRange}
                monthYear={monthYear}
            />
            <div className="max-h-screen pl-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-400 p-6 overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                <div className='h-20'></div>
                <div className="grid grid-cols-[80px_repeat(7,1fr)] mb-4 sticky top-0 z-10">
                    <div className="text-gray-400"></div>
                    {weekDates.map((date, index) => (
                        <div 
                            key={index}
                            className={`text-center p-2 cursor-pointer ${
                                date.toDateString() === new Date().toDateString()
                                ? 'bg-blue-900 bg-opacity-50 hover:bg-blue-950 hover:bg-opacity-60 rounded-lg'
                                : 'hover:bg-gray-900 hover:bg-opacity-60 rounded-lg'
                            }`}
                            onClick={() => {
                                handleDateChange(date); // Update the state within WeekView
                                onDay(date); // Pass the selected date to the parent to navigate to DayView
                            }}
                        >
                            <div className="text-sm text-gray-400">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className={`text-xl font-bold ${
                                date.toDateString() === new Date().toDateString()
                                ? 'text-blue-400'
                                : ''
                            }`}>
                                {date.getDate()}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="relative bg-gray-800 bg-opacity-50 rounded-xl shadow-2xl border border-gray-600">
                    {timeSlots.map((time, index) => (
                        <div 
                            key={time}
                            className={`grid grid-cols-[80px_repeat(7,1fr)] ${
                                index < timeSlots.length - 1 ? 'border-b border-gray-600' : ''
                            }`}
                        >
                            <div className="text-gray-500 p-2 text-sm">
                                {time}
                            </div>
                            {weekDates.map((date, dateIndex) => {
                                // Show time indicator only for current date
                                const isCurrentDate = date.toDateString() === now.toDateString();
                                const showTimeIndicator = isCurrentDate && 
                                    timeToMinutes(`${time} ${time.includes('PM') ? 'PM' : 'AM'}`) <= 
                                    timeToMinutes(`${now.getHours() % 12 || 12}:${now.getMinutes()} ${now.getHours() >= 12 ? 'PM' : 'AM'}`) && 
                                    timeToMinutes(`${time} ${time.includes('PM') ? 'PM' : 'AM'}`) + 60 > 
                                    timeToMinutes(`${now.getHours() % 12 || 12}:${now.getMinutes()} ${now.getHours() >= 12 ? 'PM' : 'AM'}`);

                                // Get events for this date
                                const dayEvents = findEventColumns(
                                    weekEvents.filter(event => 
                                        new Date(event.date).toDateString() === date.toDateString()
                                    )
                                );

                                return (
                                    <div 
                                        key={dateIndex}
                                        className="h-16 border-l border-gray-600 relative"
                                    >
                                        {showTimeIndicator && (
                                            <div 
                                                className="absolute left-0 w-full z-10"
                                                style={{ 
                                                    top: `${((now.getMinutes()) / 60) * 100}%`
                                                }}
                                            >
                                                <div className="relative">
                                                    <div className="h-0.5 bg-gray-400 w-full"></div>
                                                    <div className="absolute -left-1.5 -top-[5px] w-3 h-3 bg-gray-400 rounded-full"></div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {dayEvents.map(event => {
                                            const startMinutes = timeToMinutes(event.start);
                                            const currentSlotMinutes = timeToMinutes(time);
                                            
                                            // Only render event if it starts in this time slot
                                            if (Math.floor(startMinutes / 60) === Math.floor(currentSlotMinutes / 60)) {
                                                const duration = timeToMinutes(event.end) - startMinutes;
                                                const heightPercentage = (duration / 60) * 100;
                                                const topOffset = (startMinutes % 60) / 60 * 100;
                                                
                                                return (
                                                    <div
                                                        key={event.id}
                                                        className={`
                                                            absolute 
                                                            ${event.color} 
                                                            text-gray-200 
                                                            rounded-lg 
                                                            shadow-lg 
                                                            p-1 
                                                            border-2 
                                                            border-gray-900
                                                            overflow-hidden
                                                        `}
                                                        style={{
                                                            top: `${topOffset}%`,
                                                            height: `${heightPercentage}%`,
                                                            width: `calc(${100 / event.totalOverlaps}% - 4px)`,
                                                            left: `calc(${(event.column / event.totalOverlaps) * 100}% + 2px)`,
                                                            opacity: 0.9,
                                                        }}
                                                    >
                                                        <div className="font-semibold text-xs truncate">
                                                            {event.title}
                                                        </div>
                                                        <div className="text-xs opacity-75 truncate">
                                                            {event.participants} 👥
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default WeekView;