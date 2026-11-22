package it.ddlsolution.survivor.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "magic_link_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MagicLinkToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false, unique = true)
    private String tipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime usedAt;

    @Column(nullable = false)
    private boolean used = false;

    /**
     * Codice di 6 cifre spedito nella stessa mail del link (solo token di login): l'utente lo scrive
     * nell'app invece di cliccare il link. Salvato cifrato (BCrypt), mai in chiaro. Null per i token
     * creati prima di questa funzione o per gli altri tipi (inviti).
     */
    @Column(name = "codice_hash", length = 100)
    private String codiceHash;

    /** Tentativi sbagliati sul codice: oltre il massimo il codice non vale piu' (il link resta valido). */
    @Column(name = "tentativi_codice", nullable = false)
    private int tentativiCodice = 0;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

