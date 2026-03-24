package com.ensolvers.notes_app.service;

import com.ensolvers.notes_app.model.Category;
import com.ensolvers.notes_app.model.Note;
import com.ensolvers.notes_app.repository.CategoryRepository;
import com.ensolvers.notes_app.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Service layer handling the business logic for Notes and their Categories.
 */
@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository;

    // 1. Get all active (unarchived) notes
    public List<Note> getActiveNotes() {
        return noteRepository.findByArchived(false);
    }

    // 2. Get all archived notes
    public List<Note> getArchivedNotes() {
        return noteRepository.findByArchived(true);
    }

    // ==============================================================
    // PHASE 2: FILTERING BY CATEGORY
    // ==============================================================
    // 3. Get notes filtered by a specific category ID
    public List<Note> getNotesByCategory(Long categoryId) {
        return noteRepository.findByCategoriesId(categoryId);
    }

    // 4. Create or Update a note, ensuring categories are handled correctly
    public Note saveNote(Note note) {
        Set<Category> managedCategories = new HashSet<>();

        // Check if the note has categories attached to it
        if (note.getCategories() != null && !note.getCategories().isEmpty()) {
            for (Category category : note.getCategories()) {
                // If the category already exists in DB, use it. If not, create it.
                Optional<Category> existingCategory = categoryRepository.findByName(category.getName());
                if (existingCategory.isPresent()) {
                    managedCategories.add(existingCategory.get());
                } else {
                    // Save the new category first before attaching it to the note
                    Category newCategory = categoryRepository.save(category);
                    managedCategories.add(newCategory);
                }
            }
        }

        // Assign the managed categories back to the note
        note.setCategories(managedCategories);
        return noteRepository.save(note);
    }

    // 5. Delete a note by its ID
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    // 6. Toggle the archived status of a note
    public Note toggleArchive(Long id) {
        Optional<Note> optionalNote = noteRepository.findById(id);

        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            note.setArchived(!note.isArchived());
            return noteRepository.save(note);
        }

        throw new RuntimeException("Note not found with id: " + id);
    }
}