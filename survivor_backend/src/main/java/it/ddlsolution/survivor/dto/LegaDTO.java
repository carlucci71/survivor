package it.ddlsolution.survivor.dto;

import lombok.Data;

import java.util.List;

@Data
public class LegaDTO {
    private Long id;
    private int giornataIniziale;
    private Integer giornataCalcolata;
    private String nome;
    private CampionatoDTO campionato;
    private List<GiocatoreDTO> giocatori;
}

