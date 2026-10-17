package com.ecole.gestion_ecole.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecole.gestion_ecole.config.JwtService;
import com.ecole.gestion_ecole.config.UserPrincipal;
import com.ecole.gestion_ecole.dto.AuthResponse;
import com.ecole.gestion_ecole.dto.LoginRequest;
import com.ecole.gestion_ecole.dto.RegisterRequest;
import com.ecole.gestion_ecole.model.Admin;
import com.ecole.gestion_ecole.model.Classe;
import com.ecole.gestion_ecole.model.Eleve;
import com.ecole.gestion_ecole.model.Professeur;
import com.ecole.gestion_ecole.model.User;
import com.ecole.gestion_ecole.model.role;
import com.ecole.gestion_ecole.repository.AdminRepository;
import com.ecole.gestion_ecole.repository.ClasseRepository;
import com.ecole.gestion_ecole.repository.EleveRepository;
import com.ecole.gestion_ecole.repository.ProfesseurRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AdminRepository adminRepository;
    @Autowired private ProfesseurRepository professeurRepository;
    @Autowired private EleveRepository eleveRepository;
    @Autowired private ClasseRepository classeRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;
    @Autowired private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, @AuthenticationPrincipal UserPrincipal caller) {
        
        boolean callerIsAdmin = caller != null
                && caller.getUser().getRole() == role.ADMIN;
        boolean premierAdmin = adminRepository.count() == 0
                && request.getRole() == role.ADMIN;

        if (!callerIsAdmin && !premierAdmin) {
            return ResponseEntity.status(403)
                    .body("Seul un administrateur peut creer des comptes");
        }
    	
    	String encodedPassword = passwordEncoder.encode(request.getPassword());

        User savedUser;

        switch (request.getRole()) {
            case ADMIN -> {
                Admin admin = new Admin();
                admin.setNom(request.getNom());
                admin.setPrenom(request.getPrenom());
                admin.setEmail(request.getEmail());
                admin.setPassword(encodedPassword);
                admin.setRole(role.ADMIN);
                savedUser = adminRepository.save(admin);
            }
            case PROFESSEUR -> {
                Professeur prof = new Professeur();
                prof.setNom(request.getNom());
                prof.setPrenom(request.getPrenom());
                prof.setEmail(request.getEmail());
                prof.setPassword(encodedPassword);
                prof.setRole(role.PROFESSEUR);
                savedUser = professeurRepository.save(prof);
            }
            case ELEVE -> {
                Classe classe = classeRepository.findById(request.getClasseId())
                        .orElseThrow(() -> new RuntimeException("Classe introuvable"));
                Eleve eleve = new Eleve();
                eleve.setNom(request.getNom());
                eleve.setPrenom(request.getPrenom());
                eleve.setEmail(request.getEmail());
                eleve.setPassword(encodedPassword);
                eleve.setRole(role.ELEVE);
                eleve.setClasse(classe);
                savedUser = eleveRepository.save(eleve);
            }
            default -> throw new RuntimeException("Role invalide");
        }

        UserPrincipal principal = new UserPrincipal(savedUser);
        String token = jwtService.generateToken(principal);

        return ResponseEntity.ok(new AuthResponse(savedUser.getId(), token, savedUser.getRole().name(),
                savedUser.getNom(), savedUser.getPrenom()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        UserPrincipal principal = (UserPrincipal) authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        ).getPrincipal();

        String token = jwtService.generateToken(principal);
        User user = principal.getUser();

        return ResponseEntity.ok(new AuthResponse(user.getId(), token, user.getRole().name(),
                user.getNom(), user.getPrenom()));
    }
}