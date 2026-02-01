package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
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
    private String casaNome;
    private String fuoriNome;
    private String casaSigla;
    private String fuoriSigla;
    private Integer scoreCasa;
    private Integer scoreFuori;
    private String aliasGiornataCasa;
    private String aliasGiornataFuori;
    private short anno;
}
