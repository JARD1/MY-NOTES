package com.ensolvers.notes_app.repository;

import com.ensolvers.notes_app.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Note entity.
 * Spring Data JPA provides all the standard CRUD operations automatically.
 */
@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    // Custom method to find notes depending on their archived status
    List<Note> findByArchived(boolean archived);
}