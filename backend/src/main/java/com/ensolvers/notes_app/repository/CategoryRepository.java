package com.ensolvers.notes_app.repository;

import com.ensolvers.notes_app.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Category entity.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Custom method to find a category by its exact name.
    // This is useful to avoid creating duplicate tags.
    Optional<Category> findByName(String name);
}