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
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired private NoteRepository noteRepository;
    @Autowired private EleveRepository eleveRepository;
    @Autowired private MatiereRepository matiereRepository;
    @Autowired private ProfesseurRepository professeurRepository;

    // Un eleve ne voit que ses notes, prof/admin peuvent tout voir
    @GetMapping("/eleve/{eleveId}")
    public ResponseEntity<List<Note>> getByEleve(@PathVariable Long eleveId,
                                                  @AuthenticationPrincipal UserPrincipal principal) {
        User currentUser = principal.getUser();

        if (currentUser.getRole() == role.ELEVE && !currentUser.getId().equals(eleveId)) {
            return ResponseEntity.status(403).build();
        }

        Eleve eleve = eleveRepository.findById(eleveId)
                .orElseThrow(() -> new RuntimeException("Eleve introuvable"));
        return ResponseEntity.ok(noteRepository.findByEleve(eleve));
    }

    // Body attendu: { "eleveId": 1, "matiereId": 1, "valeur": 15.5 }
    @PostMapping
    @PreAuthorize("hasRole('PROFESSEUR')")
    public Note create(@RequestBody Map<String, Object> body,
                        @AuthenticationPrincipal UserPrincipal principal) {

        Long eleveId = Long.valueOf(body.get("eleveId").toString());
        Long matiereId = Long.valueOf(body.get("matiereId").toString());
        Double valeur = Double.valueOf(body.get("valeur").toString());

        Eleve eleve = eleveRepository.findById(eleveId)
                .orElseThrow(() -> new RuntimeException("Eleve introuvable"));
        Matiere matiere = matiereRepository.findById(matiereId)
                .orElseThrow(() -> new RuntimeException("Matiere introuvable"));
        Professeur prof = professeurRepository.findById(principal.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Professeur introuvable"));

        Note note = new Note();
        note.setEleve(eleve);
        note.setMatiere(matiere);
        note.setProfesseur(prof);
        note.setValeur(valeur);

        return noteRepository.save(note);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSEUR') or hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal UserPrincipal principal) {
        return noteRepository.findById(id)
                .map(n -> {
                    User current = principal.getUser();
                    if (current.getRole() == role.PROFESSEUR
                            && !n.getProfesseur().getId().equals(current.getId())) {
                        return ResponseEntity.status(403).<Void>build();
                    }
                    noteRepository.delete(n);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}