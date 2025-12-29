package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.entity.Sport;
import lombok.Data;

import java.util.List;

@Data
public class CampionatoDTO {
    private String id;
    private String nome;
    private SportDTO sport;
    private List<LegaDTO> leghe;
    private List<SquadraDTO> squadre;
    private int numGiornate;
    private int giornataDaGiocare;
}

