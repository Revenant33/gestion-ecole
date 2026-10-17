package com.ecole.gestion_ecole.dto;

import com.ecole.gestion_ecole.model.EnseigneA;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

// Un cours reel a une date donnee (issu de l'emploi du temps type ou ponctuel)
public record OccurrenceCours(
        Long creneauId,
        Long seanceId,
        Long annulationId,
        LocalDate date,
        DayOfWeek jourSemaine,
        LocalTime heureDebut,
        LocalTime heureFin,
        String salle,
        boolean ponctuelle,
        boolean annule,
        EnseigneA enseigneA
) {}