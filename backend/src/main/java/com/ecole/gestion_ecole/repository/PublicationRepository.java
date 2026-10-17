package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.Classe;
import com.ecole.gestion_ecole.model.Publication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByClasse(Classe classe);
}