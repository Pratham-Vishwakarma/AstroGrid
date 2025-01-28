"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle, Edit, Trash } from 'lucide-react';
import todos from './tododata'; // Assuming you have your todo data in tododata.js

const TodoView = ({ selectedDate, changeWork }) => {
  const [todosState, setTodosState] = useState([]);

  useEffect(() => {
    // Filter todos for the selected date whenever selectedDate changes
    const dayTodos = todos.filter(todo =>
      new Date(todo.date).toDateString() === selectedDate.toDateString()
    );

    // Job sequencing based on priority and then by time
    const sortedTodos = dayTodos.sort((a, b) => {
      // Priority sorting: High > Medium > Low
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      const priorityA = priorityOrder[a.priority];
      const priorityB = priorityOrder[b.priority];

      // If priority is the same, sort by time
      if (priorityA === priorityB) {
        const timeA = new Date(`1970/01/01 ${a.time.split(' - ')[0]}`);
        const timeB = new Date(`1970/01/01 ${b.time.split(' - ')[0]}`);
        return timeA - timeB; // Sort by time if priority is equal
      }
      return priorityA - priorityB; // Otherwise, sort by priority
    });

    setTodosState(sortedTodos); // Update the todosState whenever selectedDate changes
  }, [selectedDate]); // Re-run the effect when selectedDate changes

  // Toggle task completion status
  const toggleCompletion = (id) => {
    setTodosState(prevState =>
      prevState.map(todo =>
        todo.id === id ? { ...todo, status: todo.status === 'Incomplete' ? 'Complete' : 'Incomplete' } : todo
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-300 border-s-2 border-gray-600">
      <div className="max-w-4xl px-3 py-8">
        <div className="flex justify-center mb-12 w-full">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">To-Do List</h2>
                <p className="text-gray-400 mt-2">{selectedDate.toDateString()}</p>
            </div>
            <button 
                onClick={changeWork}
                className="hover:bg-gray-800 p-2 rounded-full transition-colors z-10 absolute right-8 top-12"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>

        {todosState.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-xl">No tasks for this day</p>
          </div>
        ) : (
          <div className="space-y-4 h-[71vh] overflow-y-auto overflow-x-hidden scrollbar-none px-3 py-2">
            {todosState.map((todo) => (
              <div
                key={todo.id}
                className={`${todo.color} p-4 rounded-lg shadow-lg transform transition-all hover:scale-[1.02] hover:shadow-xl flex items-start space-x-4`}
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-200">{todo.title}</h3>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400 mb-2">
                    <span>{todo.time}</span>
                    <span className={`text-sm font-semibold ${todo.status === 'Complete' ? 'text-green-500' : 'text-gray-400'}`}>
                      {todo.status}
                    </span>
                  </div>
                  <p className="text-gray-300 flex items-center space-x-2">
                    <span>{todo.description}</span>
                  </p>
                </div>
                <div className="flex flex-col justify-between items-center space-y-2">
                    <button className="text-gray-400 hover:text-gray-200">
                        <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-200">
                        <Trash className="h-5 w-5" />
                    </button>
                    <button onClick={() => toggleCompletion(todo.id)} className="text-gray-400 hover:text-gray-200">
                        {todo.status === 'Incomplete' ? (
                        <CheckCircle className="h-5 w-5" />
                        ) : (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoView;