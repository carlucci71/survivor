package it.ddlsolution.survivor.dto;

import lombok.Data;

@Data
public class GiocataRequestDTO {
    private Integer giornata;
    private Long giocatoreId;
    private Long legaId;
    private String squadraSigla;
}

