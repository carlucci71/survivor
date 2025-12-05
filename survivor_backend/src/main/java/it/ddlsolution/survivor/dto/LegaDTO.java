package it.ddlsolution.survivor.dto;

import lombok.Data;

import java.util.List;

@Data
public class LegaDTO {
    private Long id;
    private String nome;
    private String campionatoId;
    private List<GiocatoreDTO> giocatori;
}

