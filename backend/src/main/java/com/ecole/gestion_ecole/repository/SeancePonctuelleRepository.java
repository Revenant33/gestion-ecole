package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.SeancePonctuelle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SeancePonctuelleRepository extends JpaRepository<SeancePonctuelle, Long> {
    List<SeancePonctuelle> findByDateBetweenAndEnseigneAClasseId(LocalDate debut, LocalDate fin, Long classeId);
    List<SeancePonctuelle> findByDateBetweenAndEnseigneAProfesseurId(LocalDate debut, LocalDate fin, Long profId);
}