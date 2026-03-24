import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import NoteCard from './components/NoteCard';
import NoteForm from './components/NoteForm';
import noteService from './services/noteService';

/**
 * Main Application Component
 * Handles the authentication gate, fetches note data from the Spring Boot API,
 * manages the main dashboard layout, and handles CRUD operations for notes.
 */
function App() {
  // --- 1. State Definitions ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState([]);
  
  // States to manage the NoteForm Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  // --- 2. Side Effects ---

  /**
   * Effect hook that runs whenever the authentication status changes.
   * If authenticated, it fetches active notes from the backend.
   */
  useEffect(() => {
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

  // --- 3. Event Handlers (CRUD Operations) ---

  /** Opens the form modal to create a completely new note */
  const handleOpenCreateForm = () => {
    setCurrentNote(null); // Ensure form is empty
    setIsFormOpen(true);
  };

  /** Opens the form modal and pre-fills it with the selected note's data */
  const handleEdit = (note) => {
    setCurrentNote(note);
    setIsFormOpen(true);
  };

  /** * Handles saving a note (both Create and Update).
   * Communicates with the backend and updates the local UI state.
   */
  const handleFormSubmit = async (noteData) => {
    try {
      if (currentNote) {
        // UPDATE Existing Note
        const updatedNote = await noteService.updateNote(currentNote.id, noteData);
        // Map through existing notes and replace the updated one to refresh the UI immediately
        setNotes(notes.map(n => n.id === currentNote.id ? updatedNote : n));
      } else {
        // CREATE New Note
        const newNote = await noteService.createNote(noteData);
        // Add the new note to the beginning of the list in the UI
        setNotes([newNote, ...notes]);
      }
    } catch (error) {
      console.error("Error saving the note:", error);
      alert("There was an error saving your note. Please check the console.");
    }
  };

  /** Archives a note and removes it from the active notes view */
  const handleArchive = async (id) => {
    try {
      await noteService.toggleArchiveStatus(id);
      // Remove it from the current active list UI
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error archiving note:", error);
    }
  };

  /** Deletes a note permanently from the database and the UI */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note permanently?")) return;
    
    try {
      await noteService.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

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
            {/* Action button opens the modal */}
            <button 
              onClick={handleOpenCreateForm}
              className="px-5 py-2.5 text-sm font-bold rounded-xl border border-indigo-500 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95 focus:outline-none"
            >
              + New Note
            </button>
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

      {/* Note Form Modal */}
      <NoteForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        initialData={currentNote}
      />

    </div>
  );
}

export default App;