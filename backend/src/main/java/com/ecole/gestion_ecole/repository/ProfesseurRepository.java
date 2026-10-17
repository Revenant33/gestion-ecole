package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.Professeur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfesseurRepository extends JpaRepository<Professeur, Long> {
}