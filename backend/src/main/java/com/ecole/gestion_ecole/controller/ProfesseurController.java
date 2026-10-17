package com.ecole.gestion_ecole.controller;

import com.ecole.gestion_ecole.config.UserPrincipal;
import com.ecole.gestion_ecole.model.Professeur;
import com.ecole.gestion_ecole.repository.ProfesseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/professeurs")
public class ProfesseurController {

    @Autowired
    private ProfesseurRepository professeurRepository;

    @GetMapping
    public List<Professeur> getAll() {
        return professeurRepository.findAll();
    }

    @GetMapping("/me")
    public ResponseEntity<Professeur> getMe(@AuthenticationPrincipal UserPrincipal principal) {
        return professeurRepository.findById(principal.getUser().getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}