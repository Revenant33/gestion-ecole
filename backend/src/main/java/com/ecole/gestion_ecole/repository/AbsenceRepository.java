package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.Absence;
import com.ecole.gestion_ecole.model.Eleve;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AbsenceRepository extends JpaRepository<Absence, Long> {
    List<Absence> findByEleve(Eleve eleve);
    List<Absence> findByEleveClasseIdAndMatiereId(Long classeId, Long matiereId);
}
