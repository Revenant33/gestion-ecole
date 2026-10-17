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
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/remarques")
public class RemarqueCalendrierController {

    @Autowired private RemarqueCalendrierRepository remarqueCalendrierRepository;
    @Autowired private ProfesseurRepository professeurRepository;

    // Le prof ne voit que ses propres remarques (notes perso)
    @GetMapping("/mes-remarques")
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<List<RemarqueCalendrier>> getMesRemarques(@AuthenticationPrincipal UserPrincipal principal) {
        Professeur prof = professeurRepository.findById(principal.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Professeur introuvable"));
        return ResponseEntity.ok(remarqueCalendrierRepository.findByProfesseur(prof));
    }

    // Body attendu: { "date": "2026-09-15", "contenu": "..." }
    @PostMapping
    @PreAuthorize("hasRole('PROFESSEUR')")
    public RemarqueCalendrier create(@RequestBody Map<String, String> body,
                                      @AuthenticationPrincipal UserPrincipal principal) {

        Professeur prof = professeurRepository.findById(principal.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Professeur introuvable"));

        RemarqueCalendrier remarque = new RemarqueCalendrier();
        remarque.setProfesseur(prof);
        remarque.setDate(LocalDate.parse(body.get("date")));
        remarque.setContenu(body.get("contenu"));

        return remarqueCalendrierRepository.save(remarque);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSEUR')")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal UserPrincipal principal) {
        return remarqueCalendrierRepository.findById(id)
                .map(r -> {
                    if (!r.getProfesseur().getId().equals(principal.getUser().getId())) {
                        return ResponseEntity.status(403).<Void>build();
                    }
                    remarqueCalendrierRepository.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}