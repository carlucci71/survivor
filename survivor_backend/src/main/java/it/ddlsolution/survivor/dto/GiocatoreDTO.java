package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enumeratori;
import lombok.Data;

import java.util.List;

@Data
public class GiocatoreDTO {
    private Long id;
    private String nome;
    private enumeratori.StatoGiocatore stato;
    private List<GiocataDTO> giocate;
}

