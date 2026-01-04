package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.entity.Sport;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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
}

