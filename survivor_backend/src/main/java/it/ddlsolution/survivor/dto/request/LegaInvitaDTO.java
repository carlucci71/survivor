package it.ddlsolution.survivor.dto.request;

import jakarta.validation.Valid;
import lombok.Data;

import java.util.List;

@Data
@Valid
public class LegaInvitaDTO {
    private List<String> emails;
    private Boolean mobile;
}

