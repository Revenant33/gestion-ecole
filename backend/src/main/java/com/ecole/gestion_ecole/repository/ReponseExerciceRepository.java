package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.Publication;
import com.ecole.gestion_ecole.model.ReponseExercice;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ecole.gestion_ecole.model.Eleve;

import java.util.List;

public interface ReponseExerciceRepository extends JpaRepository<ReponseExercice, Long> {
    List<ReponseExercice> findByPublication(Publication publication);
    List<ReponseExercice> findByEleve(Eleve eleve);
}