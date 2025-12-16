package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class GiocatoreDTO {
    private Long id;
    private String nome;
    private Enumeratori.StatoGiocatore stato;
    private List<GiocataDTO> giocate;
    private UserDTO user;
    private List<LegaDTO> leghe = new ArrayList<>();

}

