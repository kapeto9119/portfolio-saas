'use client';

import { useState, useCallback } from 'react';

// Define TodoItem interface with proper types
interface TodoItem {
  id: string; // Changed from number to string for better uniqueness
  text: string;
  completed: boolean;
}

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');

  // Improved ID generation using random unique IDs
  const generateId = useCallback((): string => {
    return crypto.randomUUID();
  }, []);

  // Add a new todo with improved error handling
  const addTodo = useCallback(() => {
    const trimmedInput = input.trim();
    if (trimmedInput === '') return;
    
    const newTodo: TodoItem = {
      id: generateId(),
      text: trimmedInput,
      completed: false
    };
    
    setTodos(prevTodos => [...prevTodos, newTodo]);
    setInput('');
  }, [input, generateId]);

  // Toggle todo completion status with functional state update
  const toggleTodo = useCallback((id: string) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  // Delete a todo with functional state update
  const deleteTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    addTodo();
  }, [addTodo]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Todo List</h2>
      
      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          aria-label="New task input"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
          aria-label="Add task"
        >
          Add
        </button>
      </form>
      
      {todos.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No tasks yet. Add one above!</p>
      ) : (
        <ul className="space-y-2" role="list">
          {todos.map(todo => (
            <li 
              key={todo.id} 
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                  aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                />
                <span 
                  className={`ml-2 ${
                    todo.completed 
                      ? 'line-through text-gray-500 dark:text-gray-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
                aria-label={`Delete "${todo.text}"`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {todos.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>{todos.filter(todo => todo.completed).length} of {todos.length} tasks completed</p>
        </div>
      )}
    </div>
  );
} 