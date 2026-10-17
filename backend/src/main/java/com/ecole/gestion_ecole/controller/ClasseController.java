package com.ecole.gestion_ecole.controller;

import com.ecole.gestion_ecole.model.Classe;
import com.ecole.gestion_ecole.repository.ClasseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.ecole.gestion_ecole.model.Eleve;
import com.ecole.gestion_ecole.repository.EleveRepository;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClasseController {

    @Autowired
    private ClasseRepository classeRepository;

    @GetMapping
    public List<Classe> getAll() {
        return classeRepository.findAll();
    }
    @Autowired
    private EleveRepository eleveRepository;
    
    @PreAuthorize("hasRole('PROFESSEUR') or hasRole('ADMIN')")
    @GetMapping("/{id}/eleves")
    public ResponseEntity<List<Eleve>> getEleves(@PathVariable Long id) {
        return classeRepository.findById(id)
                .map(classe -> ResponseEntity.ok(eleveRepository.findByClasse(classe)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Classe> getById(@PathVariable Long id) {
        return classeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Classe create(@RequestBody Classe classe) {
        return classeRepository.save(classe);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Classe> update(@PathVariable Long id, @RequestBody Classe updated) {
        return classeRepository.findById(id)
                .map(classe -> {
                    classe.setNom(updated.getNom());
                    classe.setAnnee(updated.getAnnee());
                    classe.setSpecialite(updated.getSpecialite());
                    return ResponseEntity.ok(classeRepository.save(classe));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!classeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        classeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}