package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.EnseigneA;
import com.ecole.gestion_ecole.model.Professeur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnseigneARepository extends JpaRepository<EnseigneA, Long> {
    List<EnseigneA> findByProfesseur(Professeur professeur);
    boolean existsByProfesseurIdAndClasseIdAndMatiereId(Long profId, Long classeId, Long matiereId);
}