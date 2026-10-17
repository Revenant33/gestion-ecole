package com.ecole.gestion_ecole.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "eleves")
@PrimaryKeyJoinColumn(name = "id")
@Getter
@Setter
@NoArgsConstructor
public class Eleve extends User {

    @ManyToOne
    @JoinColumn(name = "classe_id", nullable = false)
    private Classe classe;
}