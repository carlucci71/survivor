package it.ddlsolution.survivor.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "reaction_giocata",
        uniqueConstraints = @UniqueConstraint(columnNames = {"giocata_id", "giocatore_id"}))
@Data
public class ReactionGiocata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giocata_id", nullable = false)
    private Giocata giocata;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giocatore_id", nullable = false)
    private Giocatore giocatore;

    @Column(name = "emoji", nullable = false, length = 10)
    private String emoji;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
