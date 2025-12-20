package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.Enumeratori;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PartitaDTO {
    private String sportId;
    private String campionatoId;
    private int giornata;
    private LocalDateTime orario;
    private Enumeratori.StatoPartita stato;
    private String casa;
    private String fuori;
    private Integer scoreCasa;
    private Integer scoreFuori;
}
