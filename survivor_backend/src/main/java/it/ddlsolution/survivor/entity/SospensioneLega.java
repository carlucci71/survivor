package it.ddlsolution.survivor.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Data;

import java.io.Serializable;

@Entity
@Table(name = "sospensione_lega")
@Data
public class SospensioneLega implements Serializable {

    @EmbeddedId
    private SospensioneLegaId id = new SospensioneLegaId();

    @ManyToOne
    @MapsId("idLega")
    @JoinColumn(name = "id_lega")
    private Lega lega;

    @Embeddable
    @Data
    public static class SospensioneLegaId implements Serializable {
        @Column(name = "giornata")
        private Integer giornata;

        @Column(name = "id_lega")
        private Long idLega;
    }
}

