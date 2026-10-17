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
@RequestMapping("/api/notes-disciplinaires")
public class NoteDisciplinaireController {

    @Autowired private NoteDisciplinaireRepository noteDisciplinaireRepository;
    @Autowired private EleveRepository eleveRepository;
    @Autowired private AdminRepository adminRepository;

    // Un eleve ne voit que les siennes, prof/admin peuvent tout voir
    @GetMapping("/eleve/{eleveId}")
    public ResponseEntity<List<NoteDisciplinaire>> getByEleve(@PathVariable Long eleveId,
                                                               @AuthenticationPrincipal UserPrincipal principal) {
        User currentUser = principal.getUser();

        if (currentUser.getRole() == role.ELEVE && !currentUser.getId().equals(eleveId)) {
            return ResponseEntity.status(403).build();
        }

        Eleve eleve = eleveRepository.findById(eleveId)
                .orElseThrow(() -> new RuntimeException("Eleve introuvable"));
        return ResponseEntity.ok(noteDisciplinaireRepository.findByEleve(eleve));
    }

    // Body attendu: { "eleveId": 1, "description": "..." }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public NoteDisciplinaire create(@RequestBody Map<String, String> body,
                                     @AuthenticationPrincipal UserPrincipal principal) {

        Eleve eleve = eleveRepository.findById(Long.valueOf(body.get("eleveId")))
                .orElseThrow(() -> new RuntimeException("Eleve introuvable"));
        Admin admin = adminRepository.findById(principal.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Admin introuvable"));

        NoteDisciplinaire note = new NoteDisciplinaire();
        note.setEleve(eleve);
        note.setDescription(body.get("description"));
        note.setAdmin(admin);

        return noteDisciplinaireRepository.save(note);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!noteDisciplinaireRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        noteDisciplinaireRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}