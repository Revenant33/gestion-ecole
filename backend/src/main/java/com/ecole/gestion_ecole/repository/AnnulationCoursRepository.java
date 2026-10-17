package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.AnnulationCours;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AnnulationCoursRepository extends JpaRepository<AnnulationCours, Long> {
    List<AnnulationCours> findByDateBetween(LocalDate debut, LocalDate fin);
    List<AnnulationCours> findByCreneauId(Long creneauId);
    boolean existsByCreneauIdAndDate(Long creneauId, LocalDate date);
}