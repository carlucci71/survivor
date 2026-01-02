package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;

import java.util.List;
import java.util.Map;

public interface ICalendario {
    List<PartitaDTO> getPartite(String sport, String campionato, int giornata);
    Map<Integer, String> roundTennis();
    Map<String, Map<String, String>> mapForAdapt();
}
