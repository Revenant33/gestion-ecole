package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.Professeur;
import com.ecole.gestion_ecole.model.RemarqueCalendrier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RemarqueCalendrierRepository extends JpaRepository<RemarqueCalendrier, Long> {
    List<RemarqueCalendrier> findByProfesseur(Professeur professeur);
}