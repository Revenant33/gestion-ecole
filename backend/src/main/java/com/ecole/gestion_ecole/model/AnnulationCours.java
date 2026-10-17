package com.ecole.gestion_ecole.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "annulations_cours", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"creneau_id", "date"})
})
@Getter
@Setter
@NoArgsConstructor

public class AnnulationCours {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @ManyToOne
	    @JoinColumn(name = "creneau_id", nullable = false)
	    private CreneauCours creneau;

	    @Column(nullable = false)
	    private LocalDate date;

}
