package com.ecole.gestion_ecole.controller;

import com.ecole.gestion_ecole.config.UserPrincipal;
import com.ecole.gestion_ecole.model.*;
import com.ecole.gestion_ecole.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reponses")
public class ReponseExerciceController {

    @Autowired private ReponseExerciceRepository reponseExerciceRepository;
    @Autowired private PublicationRepository publicationRepository;
    @Autowired private EleveRepository eleveRepository;

    // Le prof consulte toutes les reponses d'un exercice (comme un thread), ordonnees
    @PreAuthorize("hasRole('PROFESSEUR') or hasRole('ADMIN')")
    @GetMapping("/publication/{publicationId}")
    public ResponseEntity<List<ReponseExercice>> getByPublication(@PathVariable Long publicationId) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new RuntimeException("Publication introuvable"));
        return ResponseEntity.ok(reponseExerciceRepository.findByPublication(publication));
    }

    // Body attendu: { "publicationId": 1, "contenu": "..." }
    @PostMapping
    @PreAuthorize("hasRole('ELEVE')")
    public ReponseExercice create(@RequestBody Map<String, String> body,
                                   @AuthenticationPrincipal UserPrincipal principal) {

        Publication publication = publicationRepository.findById(Long.valueOf(body.get("publicationId")))
                .orElseThrow(() -> new RuntimeException("Publication introuvable"));
        Eleve eleve = eleveRepository.findById(principal.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Eleve introuvable"));

        ReponseExercice reponse = new ReponseExercice();
        reponse.setPublication(publication);
        reponse.setEleve(eleve);
        reponse.setContenu(body.get("contenu"));

        return reponseExerciceRepository.save(reponse);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!reponseExerciceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reponseExerciceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}