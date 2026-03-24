import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import NoteCard from './components/NoteCard';
import NoteForm from './components/NoteForm';
import noteService from './services/noteService';
import categoryService from './services/categoryService';

/**
 * Main Application Component
 * Handles authentication, fetching data, Phase 2 filtering, 
 * and dynamic UI theming (Fonts & Colors).
 */
function App() {
  // --- 1. State Definitions ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState([]);
  
  // Phase 2: Category States
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Toggle between Active and Archived notes
  const [showingArchived, setShowingArchived] = useState(false);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  // --- EXTRA: Theming States ---
  const [currentFont, setCurrentFont] = useState('font-sans'); // Default font
  const [colorTheme, setColorTheme] = useState(''); // Default color (no hue-rotate)

  // --- 2. Side Effects ---

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
    // Dynamic Theming applied here to the root div (currentFont and colorTheme)
    <div className={`min-h-screen bg-slate-900 text-white selection:bg-indigo-500/30 transition-all duration-500 ${currentFont} ${colorTheme}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-700 pb-5 gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            {showingArchived ? 'Archived Notes' : 'My Notes'}
          </h1>
          
          <div className="flex flex-wrap gap-3 justify-center items-center">
            
            {/* EXTRA: Theming Controls */}
            <div className="flex space-x-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700">
              
              {/* Font Selector */}
              <select 
                value={currentFont} 
                onChange={(e) => setCurrentFont(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-semibold focus:outline-none cursor-pointer"
                title="Change Font Style"
              >
                <option value="font-sans">Sans (Modern)</option>
                <option value="font-serif">Serif (Classic)</option>
                <option value="font-mono">Mono (Code)</option>
                <option value="font-[cursive]">Cursive (Playful)</option>
                <option value="font-[fantasy]">Fantasy (Bold)</option>
              </select>
              
              <div className="w-px bg-slate-600"></div>
              
              {/* Color Theme Selector */}
              <select 
                value={colorTheme} 
                onChange={(e) => setColorTheme(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-semibold focus:outline-none cursor-pointer"
                title="Change Color Theme"
              >
                <option value="">Indigo (Default)</option>
                <option value="hue-rotate-[270deg]">Emerald</option>
                <option value="hue-rotate-90">Rose</option>
                <option value="hue-rotate-180">Amber</option>
                <option value="grayscale">Noir (B&W)</option>
              </select>

            </div>

            {/* Toggle Archived/Active */}
            <button 
              onClick={() => setShowingArchived(!showingArchived)}
              className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all active:scale-95 focus:outline-none ${
                showingArchived 
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-600 hover:text-white' 
                  : 'border-slate-500 bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {showingArchived ? 'View Active' : 'View Archived'}
            </button>

            {/* New Note */}
            <button 
              onClick={handleOpenCreateForm}
              className="px-4 py-2 text-sm font-bold rounded-xl border border-indigo-500 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95 focus:outline-none"
            >
              + New Note
            </button>
            
            {/* Logout */}
            <button 
              className="px-4 py-2 text-sm font-bold rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-95 focus:outline-none" 
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Phase 2: Category Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-sm font-medium text-slate-400 mr-2">Filter by:</span>
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