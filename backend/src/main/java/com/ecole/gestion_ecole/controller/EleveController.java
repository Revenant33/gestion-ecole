package com.ecole.gestion_ecole.controller;

import com.ecole.gestion_ecole.config.UserPrincipal;
import com.ecole.gestion_ecole.model.Eleve;
import com.ecole.gestion_ecole.repository.EleveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/eleves")
public class EleveController {

    @Autowired
    private EleveRepository eleveRepository;

    @GetMapping("/me")
    public ResponseEntity<Eleve> getMe(@AuthenticationPrincipal UserPrincipal principal) {
        return eleveRepository.findById(principal.getUser().getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}