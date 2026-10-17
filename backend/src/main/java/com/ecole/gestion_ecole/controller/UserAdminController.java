package com.ecole.gestion_ecole.controller;

import com.ecole.gestion_ecole.model.Classe;
import com.ecole.gestion_ecole.model.Eleve;
import com.ecole.gestion_ecole.model.role;
import com.ecole.gestion_ecole.model.User;
import com.ecole.gestion_ecole.repository.ClasseRepository;
import com.ecole.gestion_ecole.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserAdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private ClasseRepository classeRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // GET /api/admin/users?role=ELEVE  (role optionnel)
    @GetMapping
    public List<User> getAll(@RequestParam(required = false) role role) {
        return userRepository.findAll().stream()
                .filter(u -> role == null || u.getRole() == role)
                .toList();
    }

    // Body: { "nom", "prenom", "email", "password" (optionnel), "photoUrl", "classeId" (eleves) }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String email = body.get("email");
        if (email != null && !email.isBlank() && !email.equals(user.getEmail())) {
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.status(409).body("Email deja utilise");
            }
            user.setEmail(email);
        }

        if (body.get("nom") != null && !body.get("nom").isBlank()) user.setNom(body.get("nom"));
        if (body.get("prenom") != null && !body.get("prenom").isBlank()) user.setPrenom(body.get("prenom"));
        if (body.get("photoUrl") != null) user.setPhotoUrl(body.get("photoUrl"));

        String password = body.get("password");
        if (password != null && !password.isBlank()) {
            user.setPassword(passwordEncoder.encode(password));
        }

        String classeId = body.get("classeId");
        if (user instanceof Eleve eleve && classeId != null && !classeId.isBlank()) {
            Classe classe = classeRepository.findById(Long.valueOf(classeId))
                    .orElseThrow(() -> new RuntimeException("Classe introuvable"));
            eleve.setClasse(classe);
        }

        return ResponseEntity.ok(userRepository.save(user));
    }
}