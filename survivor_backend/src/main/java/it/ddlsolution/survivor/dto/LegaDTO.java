package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.Enumeratori;
import lombok.Data;

import java.util.List;

@Data
public class LegaDTO {
    private Long id;
    private int giornataIniziale;
    private Integer giornataCalcolata;
    private String nome;
    private CampionatoDTO campionato;
    private List<GiocatoreDTO> giocatori;
    private int giornataCorrente;
    private Enumeratori.StatoPartita statoGiornataCorrente;

}

