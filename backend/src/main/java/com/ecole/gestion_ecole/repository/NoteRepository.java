package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.Eleve;
import com.ecole.gestion_ecole.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByEleve(Eleve eleve);
}