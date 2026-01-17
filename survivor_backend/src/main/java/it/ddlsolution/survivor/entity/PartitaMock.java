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
@Table(name = "partita_mock")
@Data
public class PartitaMock {
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

    @Column(name = "orario")
    private LocalDateTime orario;

    @Column(name = "casa_sigla", length = 200)
    private String casaSigla;

    @Column(name = "fuori_sigla", length = 200)
    private String fuoriSigla;

    @Column(name = "score_casa")
    private Integer scoreCasa;

    @Column(name = "score_fuori")
    private Integer scoreFuori;

    @Column(name = "anno")
    private short anno;

}
