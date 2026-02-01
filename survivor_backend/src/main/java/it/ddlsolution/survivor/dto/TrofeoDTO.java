package it.ddlsolution.survivor.dto;

import lombok.Data;

@Data
public class TrofeoDTO {
    private Long idLega;
    private String nomeLega;
    private Integer edizione;
    private Short anno;
    private Integer posizioneFinale;
    private String nomeCampionato;
    private String nomeSport;
    private String idSport;
    private Integer giornateGiocate;
    private String ultimaSquadraScelta;
}
