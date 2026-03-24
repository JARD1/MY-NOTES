package com.ensolvers.notes_app.controller;

import com.ensolvers.notes_app.model.Note;
import com.ensolvers.notes_app.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller providing endpoints for the Notes application.
 * CrossOrigin allows requests from the frontend (React Vite default port 5173).
 */
@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*") // Allows access from any origin (useful for local development)
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    // GET: /api/notes/active - Lists all unarchived notes
    @GetMapping("/active")
    public ResponseEntity<List<Note>> getActiveNotes() {
        return ResponseEntity.ok(noteService.getActiveNotes());
    }

    // GET: /api/notes/archived - Lists all archived notes
    @GetMapping("/archived")
    public ResponseEntity<List<Note>> getArchivedNotes() {
        return ResponseEntity.ok(noteService.getArchivedNotes());
    }

    // POST: /api/notes - Creates a new note
    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        Note createdNote = noteService.saveNote(note);
        return new ResponseEntity<>(createdNote, HttpStatus.CREATED);
    }

    // PUT: /api/notes/{id} - Updates an existing note
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note note) {
        // Ensure the ID in the path matches the entity to update
        note.setId(id);
        Note updatedNote = noteService.saveNote(note);
        return ResponseEntity.ok(updatedNote);
    }

    // DELETE: /api/notes/{id} - Deletes a note
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    // PATCH: /api/notes/{id}/archive - Toggles the archived status
    @PatchMapping("/{id}/archive")
    public ResponseEntity<Note> toggleArchive(@PathVariable Long id) {
        Note updatedNote = noteService.toggleArchive(id);
        return ResponseEntity.ok(updatedNote);
    }
}