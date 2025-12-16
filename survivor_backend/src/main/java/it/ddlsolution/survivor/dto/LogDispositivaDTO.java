package it.ddlsolution.survivor.dto;

import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class LogDispositivaDTO{
        Long id;
        String tipologia;
        String esito;
        String messaggio;
        Integer idErrore;
        List<ParamLogDispositivaDTO> paramLogDispositive;
        final UserDTO user;
        final LocalDateTime timestamp;
    }