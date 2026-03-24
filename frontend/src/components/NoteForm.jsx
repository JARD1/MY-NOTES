import React, { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';

/**
 * NoteForm Component
 * Renders a modal overlay with a form to create or edit a note, including Phase 2 category selection.
 * * @param {boolean} isOpen - Determines if the modal is visible.
 * @param {function} onClose - Callback function to close the modal.
 * @param {function} onSubmit - Callback function triggered when the form is submitted.
 * @param {Object} initialData - Optional note data used to pre-fill the form when editing.
 */
const NoteForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  // --- 1. State Definitions ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  
  // States for Phase 2: Categories (Tags)
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  // --- 2. Side Effects ---
  
  /**
   * Fetches available categories from the backend whenever the modal opens.
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setAvailableCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  /**
   * Pre-fills the form fields if we are editing an existing note.
   * Uses a zero-delay timeout to avoid ESLint's synchronous update warnings.
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (initialData) {
        setTitle(initialData.title || '');
        setContent(initialData.content || '');
        // Pre-load existing categories if editing
        setSelectedCategories(initialData.categories || []);
      } else {
        setTitle('');
        setContent('');
        setSelectedCategories([]);
      }
      setError('');
      setNewCategoryName('');
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [initialData, isOpen]);

  // --- 3. Event Handlers ---

  /** Toggles a category in or out of the selectedCategories array */
  const handleCategoryToggle = (category) => {
    const isSelected = selectedCategories.some(c => c.id === category.id);
    if (isSelected) {
      // Remove it if it was already selected
      setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
    } else {
      // Add it to the selection
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  /** Creates a new category in the backend and auto-selects it */
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      const newCat = await categoryService.createCategory({ name: newCategoryName.trim() });
      setAvailableCategories([...availableCategories, newCat]);
      setSelectedCategories([...selectedCategories, newCat]);
      setNewCategoryName('');
      setError(''); // Clear errors if successful
    } catch (err) {
      console.error("Error creating category:", err);
      setError("Could not create tag. It might already exist or the name is invalid.");
    }
  };

  /** Handles the final form submission */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required.');
      return;
    }

    // Pass the collected data back to the App component, including selected categories
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      archived: initialData ? initialData.archived : false,
      categories: selectedCategories 
    });

    onClose();
  };

  // --- 4. Render Logic ---

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform transition-all my-8">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors focus:outline-none">
            ✕
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6">
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Project Ideas"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              autoFocus
            />
          </div>

          {/* Content Textarea */}
          <div className="mb-5">
            <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note details here..."
              rows="4"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            ></textarea>
          </div>

          {/* --- PHASE 2: Categories Section --- */}
          <div className="mb-6 p-4 rounded-xl bg-slate-900/30 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-3">Tags (Categories)</label>
            
            {/* Create new category input */}
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateCategory())}
                placeholder="New tag name..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                className="px-3 py-2 text-sm font-bold rounded-lg bg-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Add Tag
              </button>
            </div>

            {/* Render available categories as selectable badges */}
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
              {availableCategories.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No tags available. Create one above!</span>
              ) : (
                availableCategories.map(category => {
                  const isSelected = selectedCategories.some(c => c.id === category.id);
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategoryToggle(category)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                        isSelected 
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-400'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {category.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-all active:scale-95 focus:outline-none"
            >
              {initialData ? 'Update Note' : 'Save Note'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NoteForm;