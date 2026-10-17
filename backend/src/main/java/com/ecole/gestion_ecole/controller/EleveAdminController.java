package com.ecole.gestion_ecole.controller;

import com.ecole.gestion_ecole.model.Classe;
import com.ecole.gestion_ecole.model.Eleve;
import com.ecole.gestion_ecole.repository.ClasseRepository;
import com.ecole.gestion_ecole.repository.EleveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.ecole.gestion_ecole.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/eleves")
@PreAuthorize("hasRole('ADMIN')")
public class EleveAdminController {

    @Autowired private EleveRepository eleveRepository;
    @Autowired private ClasseRepository classeRepository;
    @Autowired private NoteRepository noteRepository;
    @Autowired private AbsenceRepository absenceRepository;
    @Autowired private NoteDisciplinaireRepository noteDisciplinaireRepository;
    @Autowired private ReponseExerciceRepository reponseExerciceRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // Filtres tous optionnels: GET /api/admin/eleves?nom=chb&classeId=1&annee=2025-2026&specialite=DSI
    @GetMapping
    public List<Eleve> rechercher(@RequestParam(required = false) String nom,
                                   @RequestParam(required = false) Long classeId,
                                   @RequestParam(required = false) String annee,
                                   @RequestParam(required = false) String specialite) {
        return eleveRepository.rechercher(nom, classeId, annee, specialite);
    }
    
    

    // Body attendu: { "eleveIds": [1,2,3], "nouvelleClasseId": 5 }
    @PostMapping("/changer-classe")
    public ResponseEntity<List<Eleve>> changerClasseEnMasse(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Integer> ids = (List<Integer>) body.get("eleveIds");
        Long nouvelleClasseId = Long.valueOf(body.get("nouvelleClasseId").toString());

        Classe nouvelleClasse = classeRepository.findById(nouvelleClasseId)
                .orElseThrow(() -> new RuntimeException("Classe introuvable"));

        List<Eleve> eleves = ids.stream()
                .map(id -> eleveRepository.findById(id.longValue())
                        .orElseThrow(() -> new RuntimeException("Eleve introuvable: " + id)))
                .peek(eleve -> eleve.setClasse(nouvelleClasse))
                .toList();

        return ResponseEntity.ok(eleveRepository.saveAll(eleves));
    }
    
 // Body: { "eleveIds": [1,2,3], "motDePasse": "temporaire123" }
    @PostMapping("/reinitialiser-mot-de-passe")
    public ResponseEntity<?> reinitialiserMotDePasse(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Integer> ids = (List<Integer>) body.get("eleveIds");
        String motDePasse = (String) body.get("motDePasse");

        if (motDePasse == null || motDePasse.length() < 6) {
            return ResponseEntity.badRequest().body("Mot de passe trop court (6 caracteres minimum)");
        }
        String hash = passwordEncoder.encode(motDePasse);
        List<Eleve> eleves = eleveRepository.findAllById(ids.stream().map(Integer::longValue).toList());
        eleves.forEach(e -> e.setPassword(hash));
        eleveRepository.saveAll(eleves);

        return ResponseEntity.ok(Map.of("modifies", eleves.size()));
    }

 // Supprime d'abord les donnees liees, sinon MySQL refuse (cle etrangere)
    @DeleteMapping("/supprimer-en-masse")
    @Transactional
    public ResponseEntity<Void> supprimerEnMasse(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Integer> ids = (List<Integer>) body.get("eleveIds");

        for (Integer id : ids) {
            eleveRepository.findById(id.longValue()).ifPresent(eleve -> {
                reponseExerciceRepository.deleteAll(reponseExerciceRepository.findByEleve(eleve));
                noteRepository.deleteAll(noteRepository.findByEleve(eleve));
                absenceRepository.deleteAll(absenceRepository.findByEleve(eleve));
                noteDisciplinaireRepository.deleteAll(noteDisciplinaireRepository.findByEleve(eleve));
                eleveRepository.delete(eleve);
            });
        }
        return ResponseEntity.noContent().build();
    }
}