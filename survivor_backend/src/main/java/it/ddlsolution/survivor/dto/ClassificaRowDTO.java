package it.ddlsolution.survivor.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClassificaRowDTO {
    private String sigla;
    private String nome;
    private int pj;
    private int v;
    private int n;
    private int p;
    private int punti;
    private int gf;
    private int gs;
}
