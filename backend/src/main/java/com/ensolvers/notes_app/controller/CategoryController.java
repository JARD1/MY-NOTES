package com.ensolvers.notes_app.controller;

import com.ensolvers.notes_app.model.Category;
import com.ensolvers.notes_app.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller providing endpoints for Categories (Tags).
 * Essential for Phase 2: Tag application and filtering.
 */
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*") // Allows access from the React frontend
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    // GET: /api/categories - Lists all available categories
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // POST: /api/categories - Creates a new category
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        // Basic validation to avoid saving empty tags
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    // DELETE: /api/categories/{id} - Deletes a category by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}