package com.ecole.gestion_ecole.controller;

import com.ecole.gestion_ecole.config.UserPrincipal;
import com.ecole.gestion_ecole.dto.OccurrenceCours;
import com.ecole.gestion_ecole.model.*;
import com.ecole.gestion_ecole.repository.*;
import com.ecole.gestion_ecole.service.CalendrierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendrier")
public class CalendrierController {

    @Autowired private CalendrierService calendrierService;
    @Autowired private CreneauCoursRepository creneauRepository;
    @Autowired private AnnulationCoursRepository annulationRepository;
    @Autowired private SeancePonctuelleRepository seanceRepository;
    @Autowired private EnseigneARepository enseigneARepository;

    // Un eleve ne voit que le calendrier de sa classe
    @GetMapping("/classe/{classeId}")
    public ResponseEntity<List<OccurrenceCours>> classe(
            @PathVariable Long classeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @AuthenticationPrincipal UserPrincipal principal) {

        User current = principal.getUser();
        if (current instanceof Eleve eleve && !eleve.getClasse().getId().equals(classeId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(calendrierService.pourClasse(classeId, debut));
    }

    // Un prof ne voit que son propre calendrier
    @GetMapping("/prof/{profId}")
    public ResponseEntity<List<OccurrenceCours>> prof(
            @PathVariable Long profId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @AuthenticationPrincipal UserPrincipal principal) {

        User current = principal.getUser();
        if (current.getRole() == role.ELEVE
                || (current.getRole() == role.PROFESSEUR && !current.getId().equals(profId))) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(calendrierService.pourProf(profId, debut));
    }

    // Body: { "creneauId": 1, "date": "2026-10-12" }
    @PostMapping("/annulations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> annuler(@RequestBody Map<String, String> body) {
        CreneauCours creneau = creneauRepository.findById(Long.valueOf(body.get("creneauId"))).orElse(null);
        if (creneau == null) return ResponseEntity.notFound().build();

        LocalDate date = LocalDate.parse(body.get("date"));
        if (date.getDayOfWeek() != creneau.getJourSemaine()) {
            return ResponseEntity.badRequest().body("La date ne correspond pas au jour du creneau");
        }
        if (annulationRepository.existsByCreneauIdAndDate(creneau.getId(), date)) {
            return ResponseEntity.status(409).body("Deja annule");
        }

        AnnulationCours annulation = new AnnulationCours();
        annulation.setCreneau(creneau);
        annulation.setDate(date);
        return ResponseEntity.ok(annulationRepository.save(annulation));
    }

    @DeleteMapping("/annulations/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> retablir(@PathVariable Long id) {
        if (!annulationRepository.existsById(id)) return ResponseEntity.notFound().build();
        annulationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Body: { "enseigneAId": 1, "date": "2026-10-14", "heureDebut": "14:00", "heureFin": "16:00", "salle": "B12" }
    @PostMapping("/seances")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> ajouterSeance(@RequestBody Map<String, String> body) {
        EnseigneA enseigneA = enseigneARepository.findById(Long.valueOf(body.get("enseigneAId"))).orElse(null);
        if (enseigneA == null) return ResponseEntity.notFound().build();

        LocalTime debut = LocalTime.parse(body.get("heureDebut"));
        LocalTime fin = LocalTime.parse(body.get("heureFin"));
        if (!fin.isAfter(debut)) {
            return ResponseEntity.badRequest().body("L'heure de fin doit etre apres l'heure de debut");
        }

        SeancePonctuelle seance = new SeancePonctuelle();
        seance.setEnseigneA(enseigneA);
        seance.setDate(LocalDate.parse(body.get("date")));
        seance.setHeureDebut(debut);
        seance.setHeureFin(fin);
        seance.setSalle(body.get("salle"));
        return ResponseEntity.ok(seanceRepository.save(seance));
    }

    @DeleteMapping("/seances/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> supprimerSeance(@PathVariable Long id) {
        if (!seanceRepository.existsById(id)) return ResponseEntity.notFound().build();
        seanceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}