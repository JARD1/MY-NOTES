import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import NoteCard from './components/NoteCard';
import noteService from './services/noteService';

/**
 * Main Application Component
 * Handles the authentication gate, fetches note data from the Spring Boot API,
 * and manages the main dashboard layout using Tailwind CSS.
 */
function App() {
  // --- 1. State Definitions ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState([]);

  // --- 2. Side Effects ---

  /**
   * Effect hook that runs whenever the authentication status changes.
   * If authenticated, it fetches active notes from the backend.
   */
  useEffect(() => {
    /**
     * Internal async function to fetch notes.
     * Defined inside the effect to avoid ESLint warnings regarding 
     * synchronous state updates and closure scope.
     */
    const fetchActiveNotes = async () => {
      try {
        const data = await noteService.getActiveNotes();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes from backend:", error);
      }
    };

    if (isAuthenticated) {
      fetchActiveNotes();
    }
  }, [isAuthenticated]);

  // --- 3. Event Handlers ---

  /** Placeholder for editing a note */
  const handleEdit = (note) => console.log("Edit requested for note ID:", note.id);
  
  /** Placeholder for archiving a note */
  const handleArchive = (id) => console.log("Archive requested for note ID:", id);
  
  /** Placeholder for deleting a note */
  const handleDelete = (id) => console.log("Delete requested for note ID:", id);

  // --- 4. Render Logic (Auth Gate) ---

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // --- 5. Main UI Structure ---

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500/30">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Dashboard Navigation/Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-slate-700 pb-5 gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            My Notes
          </h1>
          <div className="flex space-x-4">
            {/* Action button to open the Note Creation form (Phase 1) */}
            <button className="px-5 py-2.5 text-sm font-bold rounded-xl border border-indigo-500 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95 focus:outline-none">
              + New Note
            </button>
            {/* Logout button to reset authentication state */}
            <button 
              className="px-5 py-2.5 text-sm font-bold rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-95 focus:outline-none" 
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Content Area: Grid Display or Empty State message */}
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-700/50">
            <p className="text-slate-500 text-xl font-medium italic">
              No active notes found. Ready to capture your next big idea?
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onEdit={handleEdit}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;