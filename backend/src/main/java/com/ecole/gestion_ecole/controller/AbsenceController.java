package com.ecole.gestion_ecole.controller;

import com.ecole.gestion_ecole.config.UserPrincipal;
import com.ecole.gestion_ecole.model.*;
import com.ecole.gestion_ecole.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/absences")
public class AbsenceController {

    @Autowired private AbsenceRepository absenceRepository;
    @Autowired private EleveRepository eleveRepository;
    @Autowired private MatiereRepository matiereRepository;
    @Autowired private EnseigneARepository enseigneARepository;
    
    @GetMapping("/eleve/{eleveId}")
    public ResponseEntity<List<Absence>> getByEleve(@PathVariable Long eleveId,
                                                     @AuthenticationPrincipal UserPrincipal principal) {
        User currentUser = principal.getUser();

        if (currentUser.getRole() == role.ELEVE && !currentUser.getId().equals(eleveId)) {
            return ResponseEntity.status(403).build();
        }

        Eleve eleve = eleveRepository.findById(eleveId)
                .orElseThrow(() -> new RuntimeException("Eleve introuvable"));
        return ResponseEntity.ok(absenceRepository.findByEleve(eleve));
    }

 // Body attendu: { "eleveId": 1, "matiereId": 1, "date": "2026-09-15", "heureDebut": "08:30", "heureFin": "10:00" }
    @PostMapping
    @PreAuthorize("hasRole('PROFESSEUR') or hasRole('ADMIN')")
    public Absence create(@RequestBody Map<String, String> body) {
        Long eleveId = Long.valueOf(body.get("eleveId"));
        Long matiereId = Long.valueOf(body.get("matiereId"));

        Eleve eleve = eleveRepository.findById(eleveId)
                .orElseThrow(() -> new RuntimeException("Eleve introuvable"));
        Matiere matiere = matiereRepository.findById(matiereId)
                .orElseThrow(() -> new RuntimeException("Matiere introuvable"));

        Absence absence = new Absence();
        absence.setEleve(eleve);
        absence.setMatiere(matiere);
        absence.setDate(LocalDate.parse(body.get("date")));
        absence.setHeureDebut(LocalTime.parse(body.get("heureDebut")));
        absence.setHeureFin(LocalTime.parse(body.get("heureFin")));

        return absenceRepository.save(absence);
    }

    @PutMapping("/{id}/justifier")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Absence> justifier(@PathVariable Long id) {
        return absenceRepository.findById(id)
                .map(absence -> {
                    absence.setJustifiee(true);
                    return ResponseEntity.ok(absenceRepository.save(absence));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/classe/{classeId}/matiere/{matiereId}")
    @PreAuthorize("hasRole('PROFESSEUR') or hasRole('ADMIN')")
    public ResponseEntity<List<Absence>> getByClasseAndMatiere(@PathVariable Long classeId,
                                                               @PathVariable Long matiereId,
                                                               @AuthenticationPrincipal UserPrincipal principal) {
        User current = principal.getUser();
        if (current.getRole() == role.PROFESSEUR
                && !enseigneARepository.existsByProfesseurIdAndClasseIdAndMatiereId(current.getId(), classeId, matiereId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(absenceRepository.findByEleveClasseIdAndMatiereId(classeId, matiereId));
    }
}