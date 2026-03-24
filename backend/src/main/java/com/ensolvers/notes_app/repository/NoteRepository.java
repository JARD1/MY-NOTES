package com.ensolvers.notes_app.repository;

import com.ensolvers.notes_app.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    // Find notes depending on their archived status
    List<Note> findByArchived(boolean archived);

    // ==============================================================
    // PHASE 2: FILTERING BY CATEGORY
    // ==============================================================
    // This magic method name tells Spring: "Look inside the Note's categories list
    // and find any note that has a category matching this specific ID"
    List<Note> findByCategoriesId(Long categoryId);
}