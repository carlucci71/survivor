package it.ddlsolution.survivor.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ParamLogDispositivaDTO {
    Long id;
    final String nome;
    final String valore;
    final String className;
}
