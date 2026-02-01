package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

@Data
public class ParametriDTO {
    private Long id;
    private Integer idLega;
    private Enumeratori.CodiciParametri codice;
    private String valore;
}
