package com.ecole.gestion_ecole.dto;

import com.ecole.gestion_ecole.model.role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String email;
    private String password;
    private role role;       // ADMIN, PROFESSEUR ou ELEVE
    private Long classeId;   // uniquement necessaire si role = ELEVE
}