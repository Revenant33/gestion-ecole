package com.ecole.gestion_ecole.controller;

import com.ecole.gestion_ecole.model.Classe;
import com.ecole.gestion_ecole.model.EnseigneA;
import com.ecole.gestion_ecole.model.Matiere;
import com.ecole.gestion_ecole.model.Professeur;
import com.ecole.gestion_ecole.repository.ClasseRepository;
import com.ecole.gestion_ecole.repository.EnseigneARepository;
import com.ecole.gestion_ecole.repository.MatiereRepository;
import com.ecole.gestion_ecole.repository.ProfesseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enseigne")
public class EnseigneAController {

    @Autowired private EnseigneARepository enseigneARepository;
    @Autowired private ProfesseurRepository professeurRepository;
    @Autowired private ClasseRepository classeRepository;
    @Autowired private MatiereRepository matiereRepository;

    @GetMapping
    public List<EnseigneA> getAll() {
        return enseigneARepository.findAll();
    }

    @GetMapping("/prof/{profId}")
    public List<EnseigneA> getByProf(@PathVariable Long profId) {
        Professeur prof = professeurRepository.findById(profId)
                .orElseThrow(() -> new RuntimeException("Professeur introuvable"));
        return enseigneARepository.findByProfesseur(prof);
    }

    // Body attendu: { "profId": 1, "classeId": 2, "matiereId": 3 }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EnseigneA create(@RequestBody Map<String, Long> body) {
        Professeur prof = professeurRepository.findById(body.get("profId"))
                .orElseThrow(() -> new RuntimeException("Professeur introuvable"));
        Classe classe = classeRepository.findById(body.get("classeId"))
                .orElseThrow(() -> new RuntimeException("Classe introuvable"));
        Matiere matiere = matiereRepository.findById(body.get("matiereId"))
                .orElseThrow(() -> new RuntimeException("Matiere introuvable"));

        EnseigneA enseigneA = new EnseigneA();
        enseigneA.setProfesseur(prof);
        enseigneA.setClasse(classe);
        enseigneA.setMatiere(matiere);

        return enseigneARepository.save(enseigneA);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!enseigneARepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        enseigneARepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}