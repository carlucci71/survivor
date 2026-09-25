package it.ddlsolution.survivor.dto.request;

import jakarta.validation.Valid;
import lombok.Data;

import java.util.List;

@Data
@Valid
public class LegaInvitaDTO {
    private List<String> emails;
    /** Sfida lampo: email o nickname di un utente già registrato. */
    private String destinatario;
}

