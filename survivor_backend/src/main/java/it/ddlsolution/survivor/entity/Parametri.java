package it.ddlsolution.survivor.entity;

import it.ddlsolution.survivor.converter.CodiciParametriConverter;
import it.ddlsolution.survivor.converter.StatoLegaConverter;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "parametri")
@Data
public class Parametri {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_lega")
    private Integer idLega;

    @Column(name = "codice", length = 100, nullable = false)
    @Convert(converter = CodiciParametriConverter.class)
    private Enumeratori.CodiciParametri codice;

    @Column(name = "valore", length = 100, nullable = false)
    private String valore;


}
