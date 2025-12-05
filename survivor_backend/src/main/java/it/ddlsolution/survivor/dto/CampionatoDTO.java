package it.ddlsolution.survivor.dto;

import lombok.Data;

import java.util.List;

@Data
public class CampionatoDTO {
    private String id;
    private String nome;
    private String sportId;
    private List<LegaDTO> leghe;
    private List<SquadraDTO> squadre;
}

