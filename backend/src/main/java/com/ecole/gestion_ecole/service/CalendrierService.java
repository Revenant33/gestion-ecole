package com.ecole.gestion_ecole.service;

import com.ecole.gestion_ecole.dto.OccurrenceCours;
import com.ecole.gestion_ecole.model.AnnulationCours;
import com.ecole.gestion_ecole.model.CreneauCours;
import com.ecole.gestion_ecole.model.SeancePonctuelle;
import com.ecole.gestion_ecole.repository.AnnulationCoursRepository;
import com.ecole.gestion_ecole.repository.CreneauCoursRepository;
import com.ecole.gestion_ecole.repository.SeancePonctuelleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
public class CalendrierService {

    @Autowired private CreneauCoursRepository creneauRepository;
    @Autowired private AnnulationCoursRepository annulationRepository;
    @Autowired private SeancePonctuelleRepository seanceRepository;

    public List<OccurrenceCours> pourClasse(Long classeId, LocalDate date) {
        LocalDate lundi = lundi(date);
        return construire(
                creneauRepository.findByClasseId(classeId),
                seanceRepository.findByDateBetweenAndEnseigneAClasseId(lundi, lundi.plusDays(6), classeId),
                lundi);
    }

    public List<OccurrenceCours> pourProf(Long profId, LocalDate date) {
        LocalDate lundi = lundi(date);
        return construire(
                creneauRepository.findByProfesseurId(profId),
                seanceRepository.findByDateBetweenAndEnseigneAProfesseurId(lundi, lundi.plusDays(6), profId),
                lundi);
    }

    private LocalDate lundi(LocalDate d) {
        return d.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }

    private List<OccurrenceCours> construire(List<CreneauCours> creneaux,
                                             List<SeancePonctuelle> seances,
                                             LocalDate lundi) {
        Map<String, AnnulationCours> annulations = new HashMap<>();
        for (AnnulationCours a : annulationRepository.findByDateBetween(lundi, lundi.plusDays(6))) {
            annulations.put(a.getCreneau().getId() + "_" + a.getDate(), a);
        }

        List<OccurrenceCours> resultat = new ArrayList<>();

        for (CreneauCours c : creneaux) {
            LocalDate date = lundi.plusDays(c.getJourSemaine().getValue() - 1);
            AnnulationCours annulation = annulations.get(c.getId() + "_" + date);
            resultat.add(new OccurrenceCours(
                    c.getId(), null, annulation != null ? annulation.getId() : null,
                    date, c.getJourSemaine(), c.getHeureDebut(), c.getHeureFin(), c.getSalle(),
                    false, annulation != null, c.getEnseigneA()));
        }

        for (SeancePonctuelle s : seances) {
            resultat.add(new OccurrenceCours(
                    null, s.getId(), null,
                    s.getDate(), s.getDate().getDayOfWeek(), s.getHeureDebut(), s.getHeureFin(), s.getSalle(),
                    true, false, s.getEnseigneA()));
        }

        return resultat;
    }
}