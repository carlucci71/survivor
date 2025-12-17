package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.Enumeratori;
import lombok.Data;

@Data
public class GiocatoreLegaDTO {
    private Long idGiocatore;
    private Long idLega;
    private Enumeratori.StatoGiocatore stato;
    private String nomeGiocatore;
    private String nomeLega;
}

