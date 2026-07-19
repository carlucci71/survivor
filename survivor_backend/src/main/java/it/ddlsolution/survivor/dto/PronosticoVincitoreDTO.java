package it.ddlsolution.survivor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PronosticoVincitoreDTO {
    private Long giocatorePronosticatoId;
    private String giocatorePronosticatoNickname;
    /** null finché la lega non è terminata, poi true/false in base al risultato */
    private Boolean indovinato;
}
