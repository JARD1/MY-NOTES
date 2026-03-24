import React, { useState } from 'react';
import Login from './components/Login';

/**
 * Main Application Component
 * Manages the global state for authentication and routing between Login and the Notes dashboard.
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500/30">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-5">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            My Notes
          </h1>
          <button 
            className="px-4 py-2 text-sm font-bold rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900" 
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </button>
        </div>
        
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm">
          <p className="font-medium">Welcome to the Notes App! You successfully logged in.</p>
        </div>

      </div>
    </div>
  );
}

export default App;