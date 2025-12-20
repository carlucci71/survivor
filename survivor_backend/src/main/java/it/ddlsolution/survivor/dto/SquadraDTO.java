package it.ddlsolution.survivor.dto;

import lombok.Data;

@Data
public class SquadraDTO {
    private Long id;
    private String sigla;
    private String nome;
    private CampionatoDTO campionato;
}

