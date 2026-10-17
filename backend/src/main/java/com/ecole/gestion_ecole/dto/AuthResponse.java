package com.ecole.gestion_ecole.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String token;
    private String role;
    private String nom;
    private String prenom;
}