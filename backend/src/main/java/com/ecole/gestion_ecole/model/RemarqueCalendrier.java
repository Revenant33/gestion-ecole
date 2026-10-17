package com.ecole.gestion_ecole.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "remarques_calendrier")
@Getter
@Setter
@NoArgsConstructor
public class RemarqueCalendrier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "prof_id", nullable = false)
    private Professeur professeur;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenu;
}