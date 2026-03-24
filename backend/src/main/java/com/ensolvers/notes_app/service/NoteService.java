package com.ensolvers.notes_app.service;

import com.ensolvers.notes_app.model.Note;
import com.ensolvers.notes_app.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service layer handling the business logic for Notes.
 */
@Service
@RequiredArgsConstructor // Lombok: Auto-generates the constructor for Dependency Injection
public class NoteService {

    private final NoteRepository noteRepository;

    // 1. Get all active (unarchived) notes
    public List<Note> getActiveNotes() {
        return noteRepository.findByArchived(false);
    }

    // 2. Get all archived notes
    public List<Note> getArchivedNotes() {
        return noteRepository.findByArchived(true);
    }

    // 3. Create a new note or Update an existing one
    public Note saveNote(Note note) {
        return noteRepository.save(note);
    }

    // 4. Delete a note by its ID
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    // 5. Toggle the archived status of a note
    public Note toggleArchive(Long id) {
        Optional<Note> optionalNote = noteRepository.findById(id);

        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            // Flip the boolean value (if true makes it false, if false makes it true)
            note.setArchived(!note.isArchived());
            return noteRepository.save(note);
        }

        throw new RuntimeException("Note not found with id: " + id);
    }
}