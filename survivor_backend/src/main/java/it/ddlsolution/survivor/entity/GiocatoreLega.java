package it.ddlsolution.survivor.entity;

import it.ddlsolution.survivor.converter.StatoGiocatoreConverter;
import it.ddlsolution.survivor.util.Enumeratori;
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
    private Enumeratori.StatoGiocatore stato = Enumeratori.StatoGiocatore.ATTIVO;

    @Embeddable
    @Data
    public static class GiocatoreLegaId implements Serializable {
        @Column(name = "id_giocatore")
        private Long idGiocatore;

        @Column(name = "id_lega")
        private Long idLega;
    }
}

