package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.dto.CalendarioDTO;

import java.util.List;

public interface ICalendario {

    List<CalendarioDTO>  calendario(String sport, String campionato);
}
