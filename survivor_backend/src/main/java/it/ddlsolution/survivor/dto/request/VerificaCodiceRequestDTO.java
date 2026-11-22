package it.ddlsolution.survivor.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Login con codice: l'email usata per chiedere il codice e le 6 cifre ricevute via mail. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificaCodiceRequestDTO {
    private String email;
    private String codice;
}
