package it.ddlsolution.survivor.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class SquadraDTO {
    private Long id;
    private String sigla;
    private String nome;
    private short anno;
}

