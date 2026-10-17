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
@RequestMapping("/api/publications")
public class PublicationController {

    @Autowired private PublicationRepository publicationRepository;
    @Autowired private ClasseRepository classeRepository;
    @Autowired private MatiereRepository matiereRepository;
    @Autowired private ProfesseurRepository professeurRepository;
    @Autowired private ReponseExerciceRepository reponseExerciceRepository;
    
    
    @GetMapping("/classe/{classeId}")
    public ResponseEntity<List<Publication>> getByClasse(@PathVariable Long classeId,
                                                         @AuthenticationPrincipal UserPrincipal principal) {
        User current = principal.getUser();
        if (current instanceof Eleve eleve && !eleve.getClasse().getId().equals(classeId)) {
            return ResponseEntity.status(403).build();
        }
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new RuntimeException("Classe introuvable"));
        return ResponseEntity.ok(publicationRepository.findByClasse(classe));
    }

    // Body attendu: { "classeId": 1, "matiereId": 1, "type": "EXERCICE", "titre": "...", "contenu": "..." }
    @PostMapping
    @PreAuthorize("hasRole('PROFESSEUR')")
    public Publication create(@RequestBody Map<String, String> body,
                               @AuthenticationPrincipal UserPrincipal principal) {

        Classe classe = classeRepository.findById(Long.valueOf(body.get("classeId")))
                .orElseThrow(() -> new RuntimeException("Classe introuvable"));
        Matiere matiere = matiereRepository.findById(Long.valueOf(body.get("matiereId")))
                .orElseThrow(() -> new RuntimeException("Matiere introuvable"));
        Professeur prof = professeurRepository.findById(principal.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Professeur introuvable"));

        Publication publication = new Publication();
        publication.setClasse(classe);
        publication.setMatiere(matiere);
        publication.setProfesseur(prof);
        publication.setType(TypePublication.valueOf(body.get("type")));
        publication.setTitre(body.get("titre"));
        publication.setContenu(body.get("contenu"));

        return publicationRepository.save(publication);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSEUR') or hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal UserPrincipal principal) {
        return publicationRepository.findById(id)
                .map(pub -> {
                    User current = principal.getUser();
                    if (current.getRole() == role.PROFESSEUR
                            && !pub.getProfesseur().getId().equals(current.getId())) {
                        return ResponseEntity.status(403).<Void>build();
                    }
                    reponseExerciceRepository.deleteAll(reponseExerciceRepository.findByPublication(pub));
                    publicationRepository.delete(pub);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}