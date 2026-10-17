package com.ecole.gestion_ecole.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "enseigne_a", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"prof_id", "classe_id", "matiere_id"})
})
@Getter
@Setter
@NoArgsConstructor
public class EnseigneA {

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
}