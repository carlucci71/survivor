package it.ddlsolution.survivor.dto;

import lombok.Data;

import java.util.List;


@Data
public class SportDTO {
    private List<CampionatoDTO> campionati;
    private String nome;
    private String id;
}


