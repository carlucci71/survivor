package it.ddlsolution.survivor.dto.request;

import lombok.Data;

@Data
public class SospensioneLegaRequestDTO {
    private Verso verso;
    private Long idLega;
    private Integer giornata;

    public enum Verso {ADD,REMOVE};
}

