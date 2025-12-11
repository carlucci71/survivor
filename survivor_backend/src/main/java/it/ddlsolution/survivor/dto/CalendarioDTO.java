package it.ddlsolution.survivor.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class CalendarioDTO {
    private String sportId;
    private String campionatoId;
    private int giornata;
    private LocalDateTime orario;
    private String stato;
    private String casa;
    private String fuori;
    private Integer golCasa;
    private Integer golFuori;
}
