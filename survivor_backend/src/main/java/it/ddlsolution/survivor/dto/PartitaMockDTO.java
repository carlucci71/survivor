package it.ddlsolution.survivor.dto;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class PartitaMockDTO {
    private Integer id;
    private String campionatoId;
    private short anno;
    private int giornata;
    private LocalDateTime orario;
    private String casaSigla;
    private String fuoriSigla;
    private Integer scoreCasa;
    private Integer scoreFuori;

}
