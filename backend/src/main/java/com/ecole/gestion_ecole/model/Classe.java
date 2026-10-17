package com.ecole.gestion_ecole.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "classes")
@Getter
@Setter
@NoArgsConstructor
public class Classe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom; // ex: "4DSI G11"

    @Column(nullable = false)
    private String annee; // ex: "2025-2026"

    private String specialite; // ex: "DSI"
}