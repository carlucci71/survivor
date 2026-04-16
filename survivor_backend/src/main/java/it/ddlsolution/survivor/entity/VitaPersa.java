package it.ddlsolution.survivor.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vita_persa")
@Data
@NoArgsConstructor
public class VitaPersa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_giocatore", nullable = false)
    private Giocatore giocatore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_lega", nullable = false)
    private Lega lega;

    /** Giornata assoluta del campionato in cui è stata persa la vita */
    @Column(name = "giornata", nullable = false)
    private int giornata;

    @Column(name = "persa_at", nullable = false)
    private LocalDateTime persaAt = LocalDateTime.now();

    public VitaPersa(Giocatore giocatore, Lega lega, int giornata) {
        this.giocatore = giocatore;
        this.lega = lega;
        this.giornata = giornata;
        this.persaAt = LocalDateTime.now();
    }
}
