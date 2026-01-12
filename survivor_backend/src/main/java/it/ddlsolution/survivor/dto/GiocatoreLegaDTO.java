package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

@Data
public class GiocatoreLegaDTO {
    private Long idGiocatore;
    private Long idLega;
    private Enumeratori.StatoGiocatore stato;
    private Enumeratori.RuoloGiocatoreLega ruolo;
    private String nomeGiocatore;
    private String nomeLega;
}

