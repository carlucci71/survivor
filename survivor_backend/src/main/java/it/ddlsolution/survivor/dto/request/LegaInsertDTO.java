package it.ddlsolution.survivor.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Valid
public class LegaInsertDTO {
    @NotBlank @NotNull
    private String nome;
    @NotBlank @NotNull
    private String sport;
    @NotBlank @NotNull
    private String campionato;
    @NotBlank @NotNull
    private int giornataIniziale;
    private String pwd;
}

