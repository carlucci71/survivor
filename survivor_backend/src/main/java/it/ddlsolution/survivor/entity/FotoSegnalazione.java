package it.ddlsolution.survivor.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

import java.time.LocalDateTime;

/** Segnalazione della foto profilo di un giocatore da parte di un altro (una sola per coppia). */
@Entity
@Table(name = "foto_segnalazione",
        uniqueConstraints = @UniqueConstraint(columnNames = {"giocatore_id", "segnalatore_id"}))
@Data
public class FotoSegnalazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Il giocatore la cui foto e' stata segnalata. */
    @Column(name = "giocatore_id", nullable = false)
    private Long giocatoreId;

    /** Il giocatore che ha segnalato. */
    @Column(name = "segnalatore_id", nullable = false)
    private Long segnalatoreId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
