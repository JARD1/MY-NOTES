package com.ensolvers.notes_app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

}