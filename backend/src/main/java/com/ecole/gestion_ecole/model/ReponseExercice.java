package com.ecole.gestion_ecole.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "reponses_exercice")
@Getter
@Setter
@NoArgsConstructor
public class ReponseExercice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "publication_id", nullable = false)
    private Publication publication;

    @ManyToOne
    @JoinColumn(name = "eleve_id", nullable = false)
    private Eleve eleve;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenu;

    @Column(nullable = false)
    private LocalDate date = LocalDate.now();
}