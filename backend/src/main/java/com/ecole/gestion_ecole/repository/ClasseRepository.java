package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.Classe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClasseRepository extends JpaRepository<Classe, Long> {
}