package com.ecole.gestion_ecole.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "publications")
@Getter
@Setter
@NoArgsConstructor
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "prof_id", nullable = false)
    private Professeur professeur;

    @ManyToOne
    @JoinColumn(name = "classe_id", nullable = false)
    private Classe classe;

    @ManyToOne
    @JoinColumn(name = "matiere_id", nullable = false)
    private Matiere matiere;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypePublication type;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String contenu;

    @Column(nullable = false)
    private LocalDate date = LocalDate.now();
}