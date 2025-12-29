package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.dto.PartitaDTO;

import java.util.List;

public interface ICalendario {

    List<PartitaDTO> partite(String sport, String campionato);
    List<PartitaDTO> partite(String sport, String campionato, int giornata);
    List<PartitaDTO> calendario(String sport, String campionato, String squadra, int giornataAttuale, boolean prossimi);


}
