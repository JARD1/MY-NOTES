import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import NoteCard from './components/NoteCard';
import NoteForm from './components/NoteForm';
import noteService from './services/noteService';
import categoryService from './services/categoryService';

/**
 * Main Application Component
 * Handles the authentication gate, fetches note data, manages the dashboard,
 * and handles Phase 2 requirements (category filtering).
 */
function App() {
  // --- 1. State Definitions ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState([]);
  
  // Phase 2: Category States
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // null means "All categories"

  // Toggle between Active and Archived notes view
  const [showingArchived, setShowingArchived] = useState(false);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  // --- 2. Side Effects ---

  /**
   * Fetches active or archived notes based on the current view state.
   */
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        let data;
        if (showingArchived) {
          data = await noteService.getArchivedNotes();
        } else {
          data = await noteService.getActiveNotes();
        }
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes from backend:", error);
      }
    };

    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated, showingArchived]);

  /**
   * Phase 2: Fetches all available categories for the filter bar.
   * Re-runs when the form closes in case the user created a new category.
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated, isFormOpen]);

  // --- 3. Derived State (Filtering) ---

  /**
   * Filters the notes array based on the currently selected category.
   * If selectedCategory is null, it shows all notes in the current view.
   */
  const displayedNotes = selectedCategory
    ? notes.filter(note => note.categories && note.categories.some(c => c.id === selectedCategory))
    : notes;

  // --- 4. Event Handlers (CRUD Operations) ---

  const handleOpenCreateForm = () => {
    setCurrentNote(null);
    setIsFormOpen(true);
  };

  const handleEdit = (note) => {
    setCurrentNote(note);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (noteData) => {
    try {
      if (currentNote) {
        const updatedNote = await noteService.updateNote(currentNote.id, noteData);
        setNotes(notes.map(n => n.id === currentNote.id ? updatedNote : n));
      } else {
        const newNote = await noteService.createNote(noteData);
        if (!showingArchived) {
          setNotes([newNote, ...notes]);
        } else {
          setShowingArchived(false);
        }
      }
    } catch (error) {
      console.error("Error saving the note:", error);
      alert("There was an error saving your note.");
    }
  };

  const handleArchiveToggle = async (id) => {
    try {
      await noteService.toggleArchiveStatus(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error toggling archive status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note permanently?")) return;
    try {
      await noteService.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // --- 5. Render Logic (Auth Gate) ---

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // --- 6. Main UI Structure ---

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500/30">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-700 pb-5 gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            {showingArchived ? 'Archived Notes' : 'My Notes'}
          </h1>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={() => setShowingArchived(!showingArchived)}
              className={`px-5 py-2 text-sm font-bold rounded-xl border transition-all active:scale-95 focus:outline-none ${
                showingArchived 
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-600 hover:text-white' 
                  : 'border-slate-500 bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {showingArchived ? 'View Active Notes' : 'View Archived'}
            </button>

            <button 
              onClick={handleOpenCreateForm}
              className="px-5 py-2 text-sm font-bold rounded-xl border border-indigo-500 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95 focus:outline-none"
            >
              + New Note
            </button>
            
            <button 
              className="px-5 py-2 text-sm font-bold rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-95 focus:outline-none" 
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Phase 2: Category Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-sm font-medium text-slate-400 mr-2">Filter by:</span>
          
          {/* "All" Button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
              selectedCategory === null 
                ? 'bg-indigo-500 border-indigo-500 text-white' 
                : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-400'
            }`}
          >
            All
          </button>
          
          {/* Dynamic Category Buttons */}
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                selectedCategory === category.id 
                  ? 'bg-indigo-500 border-indigo-500 text-white' 
                  : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-400'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Content Area */}
        {displayedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-700/50">
            <p className="text-slate-500 text-xl font-medium italic">
              {notes.length === 0 
                ? (showingArchived ? "No archived notes found." : "No active notes found.") 
                : "No notes found for this category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedNotes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onEdit={handleEdit}
                onArchive={handleArchiveToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </div>

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