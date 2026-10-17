package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.Matiere;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatiereRepository extends JpaRepository<Matiere, Long> {
}