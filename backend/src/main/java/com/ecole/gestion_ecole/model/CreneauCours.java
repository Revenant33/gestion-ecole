package com.ecole.gestion_ecole.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "creneaux_cours")
@Getter
@Setter
@NoArgsConstructor
public class CreneauCours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "enseigne_a_id", nullable = false)
    private EnseigneA enseigneA;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek jourSemaine; // MONDAY, TUESDAY, ...

    @Column(nullable = false)
    private LocalTime heureDebut;

    @Column(nullable = false)
    private LocalTime heureFin;

    private String salle; // optionnel, pratique a avoir
}