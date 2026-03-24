package com.ensolvers.notes_app.controller;

import com.ensolvers.notes_app.model.Category;
import com.ensolvers.notes_app.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller providing endpoints for Categories (Tags).
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
}