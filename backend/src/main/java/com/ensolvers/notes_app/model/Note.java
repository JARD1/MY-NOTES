package com.ensolvers.notes_app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a Note in the database.
 * Mapped to the "notes" table.
 */
@Entity
@Table(name = "notes")
@Data // Lombok: automatically generates Getters, Setters, toString, etc.
@NoArgsConstructor // Lombok: generates an empty constructor required by JPA
@AllArgsConstructor // Lombok: generates a constructor with all properties
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // By default, a new note is not archived
    @Column(name = "is_archived", nullable = false)
    private boolean archived = false;

    // ==============================================================
    // PHASE 2: CATEGORIES RELATIONSHIP (Many-To-Many)
    // ==============================================================
    /**
     * A note can have multiple categories, and a category can belong to multiple notes.
     * FetchType.EAGER ensures that when we load a Note, its categories are loaded automatically.
     * The @JoinTable annotation instructs Hibernate to create an intermediate table
     * called "note_categories" to manage the relationship in the MySQL database.
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "note_categories", // Name of the intermediate table
            joinColumns = @JoinColumn(name = "note_id"), // Foreign key for the Note
            inverseJoinColumns = @JoinColumn(name = "category_id") // Foreign key for the Category
    )
    private Set<Category> categories = new HashSet<>();

}