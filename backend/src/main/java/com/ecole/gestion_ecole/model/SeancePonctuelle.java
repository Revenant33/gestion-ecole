package com.ecole.gestion_ecole.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "seances_ponctuelles")
@Getter
@Setter
@NoArgsConstructor
public class SeancePonctuelle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "enseigne_a_id", nullable = false)
    private EnseigneA enseigneA;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime heureDebut;

    @Column(nullable = false)
    private LocalTime heureFin;

    private String salle;
}