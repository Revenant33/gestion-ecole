package com.ecole.gestion_ecole.controller;

import com.ecole.gestion_ecole.model.Matiere;
import com.ecole.gestion_ecole.repository.MatiereRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matieres")
public class MatiereController {

    @Autowired
    private MatiereRepository matiereRepository;

    @GetMapping
    public List<Matiere> getAll() {
        return matiereRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Matiere> getById(@PathVariable Long id) {
        return matiereRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Matiere create(@RequestBody Matiere matiere) {
        return matiereRepository.save(matiere);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Matiere> update(@PathVariable Long id, @RequestBody Matiere updated) {
        return matiereRepository.findById(id)
                .map(matiere -> {
                    matiere.setNom(updated.getNom());
                    return ResponseEntity.ok(matiereRepository.save(matiere));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!matiereRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        matiereRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}