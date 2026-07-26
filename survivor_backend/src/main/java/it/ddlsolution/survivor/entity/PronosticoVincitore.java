package it.ddlsolution.survivor.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "pronostico_vincitore", uniqueConstraints = @UniqueConstraint(columnNames = {"id_lega", "id_giocatore"}))
@Data
@NoArgsConstructor
public class PronosticoVincitore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_lega", nullable = false)
    private Lega lega;

    /** Il giocatore eliminato che sta pronosticando */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_giocatore", nullable = false)
    private Giocatore giocatore;

    /** Il giocatore ancora attivo che si pensa vincerà la lega */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_giocatore_pronosticato", nullable = false)
    private Giocatore giocatorePronosticato;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
