package it.ddlsolution.survivor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VotoPronosticoDTO {
    private Long giocatoreId;
    private String nickname;
    private long voti;
    /** Nickname di chi ha votato questo giocatore, in ordine alfabetico. */
    private List<String> votanti;
}
