package it.ddlsolution.survivor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VotoPronosticoDTO {
    private Long giocatoreId;
    private String nickname;
    private long voti;
}
