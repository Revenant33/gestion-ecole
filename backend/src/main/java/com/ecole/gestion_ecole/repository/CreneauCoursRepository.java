package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.CreneauCours;
import com.ecole.gestion_ecole.model.EnseigneA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CreneauCoursRepository extends JpaRepository<CreneauCours, Long> {

    List<CreneauCours> findByEnseigneA(EnseigneA enseigneA);

    @Query("SELECT c FROM CreneauCours c WHERE c.enseigneA.classe.id = :classeId")
    List<CreneauCours> findByClasseId(@Param("classeId") Long classeId);

    @Query("SELECT c FROM CreneauCours c WHERE c.enseigneA.professeur.id = :profId")
    List<CreneauCours> findByProfesseurId(@Param("profId") Long profId);
}