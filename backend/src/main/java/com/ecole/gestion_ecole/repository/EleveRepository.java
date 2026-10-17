package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.Classe;
import com.ecole.gestion_ecole.model.Eleve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EleveRepository extends JpaRepository<Eleve, Long> {

    List<Eleve> findByClasse(Classe classe);

    @Query("SELECT e FROM Eleve e WHERE " +
           "(:nom IS NULL OR LOWER(e.nom) LIKE LOWER(CONCAT('%', :nom, '%'))) AND " +
           "(:classeId IS NULL OR e.classe.id = :classeId) AND " +
           "(:annee IS NULL OR e.classe.annee = :annee) AND " +
           "(:specialite IS NULL OR e.classe.specialite = :specialite)")
    List<Eleve> rechercher(@Param("nom") String nom,
                            @Param("classeId") Long classeId,
                            @Param("annee") String annee,
                            @Param("specialite") String specialite);
}