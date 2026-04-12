package it.ddlsolution.survivor.dto.request;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Valid
public class LegaInsertDTO {
    @NotBlank @NotNull
    private String name;
    @NotBlank @NotNull
    private String sport;
    @NotBlank @NotNull
    private String campionato;
    @NotBlank @NotNull
    private int giornataIniziale;
    private Integer giornataFinale;
    private String pwd;
    private boolean pubblica;
    private Integer maxPartecipanti;
    private boolean accessoLibero;
    /** Modalità di gioco della lega (default: SURVIVOR) */
    private Enumeratori.ModalitaLega modalita = Enumeratori.ModalitaLega.SURVIVOR;
}

