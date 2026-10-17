package com.ecole.gestion_ecole.controller;

import com.ecole.gestion_ecole.model.CreneauCours;
import com.ecole.gestion_ecole.model.EnseigneA;
import com.ecole.gestion_ecole.repository.AnnulationCoursRepository;
import com.ecole.gestion_ecole.repository.CreneauCoursRepository;
import com.ecole.gestion_ecole.repository.EnseigneARepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/creneaux")
public class CreneauCoursController {

    @Autowired private CreneauCoursRepository creneauCoursRepository;
    @Autowired private EnseigneARepository enseigneARepository;
    @Autowired private AnnulationCoursRepository annulationCoursRepository;

    // Calendrier d'une classe (vu par les eleves de cette classe)
    @GetMapping("/classe/{classeId}")
    public List<CreneauCours> getByClasse(@PathVariable Long classeId) {
        return creneauCoursRepository.findByClasseId(classeId);
    }

    // Calendrier d'un prof
    @GetMapping("/prof/{profId}")
    public List<CreneauCours> getByProf(@PathVariable Long profId) {
        return creneauCoursRepository.findByProfesseurId(profId);
    }

    // Body attendu: { "enseigneAId": 1, "jourSemaine": "MONDAY", "heureDebut": "08:30", "heureFin": "10:00", "salle": "B12" }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public CreneauCours create(@RequestBody Map<String, String> body) {
        EnseigneA enseigneA = enseigneARepository.findById(Long.valueOf(body.get("enseigneAId")))
                .orElseThrow(() -> new RuntimeException("Enseignement introuvable"));

        CreneauCours creneau = new CreneauCours();
        creneau.setEnseigneA(enseigneA);
        creneau.setJourSemaine(DayOfWeek.valueOf(body.get("jourSemaine")));
        creneau.setHeureDebut(LocalTime.parse(body.get("heureDebut")));
        creneau.setHeureFin(LocalTime.parse(body.get("heureFin")));
        creneau.setSalle(body.get("salle"));

        return creneauCoursRepository.save(creneau);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!creneauCoursRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        annulationCoursRepository.deleteAll(annulationCoursRepository.findByCreneauId(id));
        creneauCoursRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}