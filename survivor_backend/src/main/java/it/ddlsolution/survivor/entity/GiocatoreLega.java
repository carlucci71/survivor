package it.ddlsolution.survivor.entity;

import it.ddlsolution.survivor.converter.RuoloGiocatoreLegaConverter;
import it.ddlsolution.survivor.converter.StatoGiocatoreConverter;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Table(name = "giocatore_lega")
@Data
public class GiocatoreLega implements Serializable {

    @EmbeddedId
    private GiocatoreLegaId id = new GiocatoreLegaId();

    @ManyToOne
    @MapsId("idGiocatore")
    @JoinColumn(name = "id_giocatore")
    private Giocatore giocatore;

    @ManyToOne
    @MapsId("idLega")
    @JoinColumn(name = "id_lega")
    private Lega lega;

    @Column(name = "stato", nullable = false, length = 1)
    @Convert(converter = StatoGiocatoreConverter.class)
    private Enumeratori.StatoGiocatore stato;

    @Column(name = "ruolo", nullable = false, length = 1)
    @Convert(converter = RuoloGiocatoreLegaConverter.class)
    private Enumeratori.RuoloGiocatoreLega ruolo;

    @Column(name = "posizione_finale")
    private Integer posizioneFinale;

    @Embeddable
    @Data
    public static class GiocatoreLegaId implements Serializable {
        @Column(name = "id_giocatore")
        private Long idGiocatore;

        @Column(name = "id_lega")
        private Long idLega;
    }
}

