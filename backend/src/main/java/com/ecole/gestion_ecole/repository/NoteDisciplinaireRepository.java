package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.Eleve;
import com.ecole.gestion_ecole.model.NoteDisciplinaire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteDisciplinaireRepository extends JpaRepository<NoteDisciplinaire, Long> {
    List<NoteDisciplinaire> findByEleve(Eleve eleve);
}