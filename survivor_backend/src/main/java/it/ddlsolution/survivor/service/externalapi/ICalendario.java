package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;

import java.util.List;
import java.util.Map;

public interface ICalendario {

    List<PartitaDTO> partite(String sport, String campionato);
    List<PartitaDTO> partite(String sport, String campionato, int giornata);
    List<PartitaDTO> ultimiRisultati(String sport, String campionato, String squadra, int giornataAttuale);
}
