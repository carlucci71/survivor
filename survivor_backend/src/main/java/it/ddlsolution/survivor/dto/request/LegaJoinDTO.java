package it.ddlsolution.survivor.dto.request;

import jakarta.validation.Valid;
import lombok.Data;

@Data
@Valid
public class LegaJoinDTO {
    private String pwd;
    private String tokenOriginal;
}

