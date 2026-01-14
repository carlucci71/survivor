package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import it.ddlsolution.survivor.converter.StatoPartitaConverter;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "partita")
@Data
public class Partita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_campionato", nullable = false)
    @JsonBackReference("campionato-leghe")
    @ToString.Exclude
    private Campionato campionato;

    @Column(name = "giornata", nullable = false)
    private int giornata;

    @Column(name = "orario", nullable = false)
    private LocalDateTime orario;

    @Column(name = "stato", nullable = false, length = 20)
    @Convert(converter = StatoPartitaConverter.class)
    private Enumeratori.StatoPartita stato;

    @Column(name = "casa_nome", nullable = false, length = 200)
    private String casaNome;

    @Column(name = "fuori_nome", nullable = false, length = 200)
    private String fuoriNome;

    @Column(name = "casa_sigla", length = 200)
    private String casaSigla;

    @Column(name = "fuori_sigla", length = 200)
    private String fuoriSigla;

    @Column(name = "score_casa")
    private Integer scoreCasa;

    @Column(name = "score_fuori")
    private Integer scoreFuori;

    @Column(name = "alias_giornata_casa", length = 200)
    private String aliasGiornataCasa;

    @Column(name = "alias_giornata_fuori", length = 200)
    private String aliasGiornataFuori;

    @Column(name = "implementation_external_api", length = 200)
    private String implementationExternalApi;

    @Column(name = "anno")
    private short anno;

}
