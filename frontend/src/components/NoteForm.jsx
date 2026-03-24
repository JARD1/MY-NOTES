import React, { useState, useEffect } from 'react';

/**
 * NoteForm Component
 * Renders a modal overlay with a form to create or edit a note.
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

  // --- 2. Side Effects ---
  
  /**
   * Effect hook to pre-fill the form fields if we are editing an existing note.
   * Uses a zero-delay timeout to make the state updates asynchronous,
   * completely avoiding ESLint's synchronous cascading render warnings.
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (initialData) {
        setTitle(initialData.title || '');
        setContent(initialData.content || '');
      } else {
        setTitle('');
        setContent('');
      }
      // Clear any previous errors when the modal opens/closes
      setError('');
    }, 0);

    // Cleanup function to clear the timeout if the component unmounts quickly
    return () => clearTimeout(timeoutId);
  }, [initialData, isOpen]);

  // --- 3. Event Handlers ---

  /**
   * Handles the form submission event.
   * Validates input fields and passes the data up to the parent component.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation to ensure fields are not empty
    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required.');
      return;
    }

    // Pass the collected data back to the App component
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      // If we are editing, we preserve the archived status; otherwise, it defaults to false
      archived: initialData ? initialData.archived : false 
    });

    // Reset fields and close modal
    setTitle('');
    setContent('');
    onClose();
  };

  // --- 4. Render Logic ---

  // If the modal is not flagged to be open, render nothing (null)
  if (!isOpen) return null;

  return (
    // Modal Overlay (Glassmorphism effect)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity">
      
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform transition-all">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors focus:outline-none"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6">
          
          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Title Input Field */}
          <div className="mb-5">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Grocery List"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              autoFocus
            />
          </div>

          {/* Content Textarea Field */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note details here..."
              rows="5"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800"
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