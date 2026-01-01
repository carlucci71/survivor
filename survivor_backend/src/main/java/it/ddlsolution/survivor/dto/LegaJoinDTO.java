package it.ddlsolution.survivor.dto;

import jakarta.validation.Valid;
import lombok.Data;

@Data
@Valid
public class LegaJoinDTO {
    private String pwd;
    private String tokenOriginal;
}

