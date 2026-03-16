package it.ddlsolution.survivor.entity;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "lega_join_request",
        uniqueConstraints = @UniqueConstraint(columnNames = {"lega_id", "giocatore_id"}))
@Data
public class LegaJoinRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lega_id", nullable = false)
    private Lega lega;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giocatore_id", nullable = false)
    private Giocatore giocatore;

    @Enumerated(EnumType.STRING)
    @Column(name = "stato", nullable = false, length = 10)
    private Enumeratori.StatoRichiesta stato = Enumeratori.StatoRichiesta.PENDING;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
