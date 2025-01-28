"use client";
import React, { useState, useMemo, useEffect } from 'react';
import events from '../data/eventdata';
import NavBar from './Navbar';
import todos from '../data/tododata';

function WeekView({ selectedDate: initialDate, onBack, onDay, view }) {
    const [currentDate, setCurrentDate] = useState(new Date(initialDate));
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

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

    const weekTodos = useMemo(() => {
        return todos.filter(todo => {
            const todoDate = new Date(todo.date);
            return weekDates.some(date => 
                date.toDateString() === todoDate.toDateString()
            );
        });
    }, [weekDates]);

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

    const findEventColumns = (dayItems) => {
        if (dayItems.length === 0) return [];
      
        const sortedItems = [...dayItems].sort((a, b) =>
          timeToMinutes(a.start || a.time) - timeToMinutes(b.start || b.time)
        );
      
        sortedItems.forEach(item => {
          const itemStart = timeToMinutes(item.start || item.time);
          const itemEnd = timeToMinutes(item.end || item.time.split(' - ')[1]);
      
          const overlaps = sortedItems.filter(existingItem => {
            const existingStart = timeToMinutes(existingItem.start || existingItem.time);
            const existingEnd = timeToMinutes(existingItem.end || existingItem.time.split(' - ')[1]);
            return !(itemEnd <= existingStart || itemStart >= existingEnd);
          });
      
          item.totalOverlaps = overlaps.length;
          item.column = overlaps.findIndex(e => e === item);
        });
      
        return sortedItems;
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
                                const dayEvents = weekEvents.filter(event => 
                                    new Date(event.date).toDateString() === date.toDateString()
                                );
                                const dayTodos = weekTodos.filter(todo => 
                                    new Date(todo.date).toDateString() === date.toDateString()
                                );

                                const dayItems = findEventColumns([
                                    ...dayEvents,
                                    ...dayTodos.map(todo => ({
                                        ...todo,
                                        isTodo: true, // Flag to distinguish todos
                                        start: todo.time.split(' - ')[0],
                                        end: todo.time.split(' - ')[1]
                                    }))
                                ]);

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
                                        
                                        {dayItems.map(item => {
                                            const startMinutes = timeToMinutes(item.start || item.time);
                                            const currentSlotMinutes = timeToMinutes(time);
                                            
                                            if (Math.floor(startMinutes / 60) === Math.floor(currentSlotMinutes / 60)) {
                                                const duration = timeToMinutes(item.end || item.time.split(' - ')[1]) - startMinutes;
                                                const heightPercentage = (duration / 60) * 100;
                                                const topOffset = (startMinutes % 60) / 60 * 100;
                                                
                                                return (
                                                    <div
                                                        key={`${item.isTodo ? 't' : 'e'}-${item.id || item.title}-${date.toDateString()}-${time}`} // Unique key with 't' for todo and 'e' for event
                                                        className={`
                                                            absolute 
                                                            ${item.color} 
                                                            text-gray-200 
                                                            rounded-lg 
                                                            shadow-lg 
                                                            p-1 
                                                            border-2 
                                                            ${item.isTodo ? 'border-dashed border-gray-400' : 'border-gray-900'}
                                                            overflow-hidden
                                                            ${item.isTodo && item.status === 'Complete' ? 'opacity-50' : 'opacity-90'}
                                                        `}
                                                        style={{
                                                            top: `${topOffset}%`,
                                                            height: `${heightPercentage}%`,
                                                            width: `calc(${100 / item.totalOverlaps}% - 4px)`,
                                                            left: `calc(${(item.column / item.totalOverlaps) * 100}% + 2px)`,
                                                        }}
                                                    >
                                                        <div className="font-semibold text-xs truncate">
                                                            {item.isTodo ? '📝 ' : ''}{item.title}
                                                        </div>
                                                        <div className="text-xs opacity-75 truncate">
                                                            {item.isTodo ? 
                                                                (item.status === 'Complete' ? '✅' : '⏳') :
                                                                `${item.participants} 👥`
                                                            }
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