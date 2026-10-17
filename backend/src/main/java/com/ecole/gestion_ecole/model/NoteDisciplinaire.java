package com.ecole.gestion_ecole.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "notes_disciplinaires")
@Getter
@Setter
@NoArgsConstructor
public class NoteDisciplinaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "eleve_id", nullable = false)
    private Eleve eleve;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate date = LocalDate.now();

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;
}