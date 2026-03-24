import React from 'react';

/**
 * NoteCard Component
 * Displays a single note with its title, content, and associated categories.
 * Provides actions to edit, archive/unarchive, and delete the note.
 * * @param {Object} note - The note data object from the backend.
 * @param {Function} onArchive - Callback when the archive button is clicked.
 * @param {Function} onDelete - Callback when the delete button is clicked.
 * @param {Function} onEdit - Callback when the edit button is clicked.
 */
const NoteCard = ({ note, onArchive, onDelete, onEdit }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-700 hover:border-indigo-500/50 transition-all group flex flex-col h-full">
      
      {/* Header: Title and action buttons */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-white leading-tight flex-1 pr-4">
          {note.title}
        </h3>
        
        {/* Action Buttons (visible on hover for a cleaner look) */}
        <div className="flex space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(note)}
            className="text-slate-400 hover:text-indigo-400 transition-colors"
            title="Edit Note"
          >
            ✏️
          </button>
          <button 
            onClick={() => onArchive(note.id)}
            className="text-slate-400 hover:text-yellow-400 transition-colors"
            title={note.archived ? "Unarchive Note" : "Archive Note"}
          >
            {note.archived ? "📤" : "📥"}
          </button>
          <button 
            onClick={() => onDelete(note.id)}
            className="text-slate-400 hover:text-red-400 transition-colors"
            title="Delete Note"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Note Content */}
      <p className="text-slate-300 whitespace-pre-wrap flex-grow mb-4 text-sm">
        {note.content}
      </p>

      {/* PHASE 2: Categories (Tags) Display */}
      {note.categories && note.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-700/50">
          {note.categories.map((category) => (
            <span 
              key={category.id} 
              className="px-2 py-1 text-xs font-semibold rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
            >
              #{category.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteCard;