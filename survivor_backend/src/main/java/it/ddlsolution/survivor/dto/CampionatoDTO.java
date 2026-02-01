package it.ddlsolution.survivor.dto;

import lombok.Data;

import java.time.LocalDateTime;
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
    private List<LocalDateTime> iniziGiornate;
    private short annoCorrente;
}

