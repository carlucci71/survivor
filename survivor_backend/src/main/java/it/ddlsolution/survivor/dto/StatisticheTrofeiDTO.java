package it.ddlsolution.survivor.dto;

import lombok.Data;
import java.util.List;

@Data
public class StatisticheTrofeiDTO {
    private List<TrofeoDTO> trofei;
    private Integer torneiGiocati;
    private Integer vittorie;
    private Integer podi; // primi 3 posti
    private Double winRate; // percentuale vittorie
}
