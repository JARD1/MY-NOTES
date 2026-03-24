package com.ensolvers.notes_app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a Category (Tag) in the database.
 * Mapped to the "categories" table.
 * This is part of Phase 2 requirements (Tag application and filtering).
 */
@Entity
@Table(name = "categories")
@Data // Lombok: automatically generates Getters, Setters, toString, etc.
@NoArgsConstructor // Lombok: generates an empty constructor required by JPA
@AllArgsConstructor // Lombok: generates a constructor with all properties
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The category name must be unique (e.g., we can't have two "Work" tags)
    @Column(nullable = false, unique = true, length = 50)
    private String name;
}