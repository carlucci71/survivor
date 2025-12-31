package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.dto.PartitaDTO;

import java.util.List;
import java.util.Map;

public interface ICalendario {

    List<PartitaDTO> partite(String sport, String campionato);

    List<PartitaDTO> partite(String sport, String campionato, int giornata);

    List<PartitaDTO> calendario(String sport, String campionato, String squadra, int giornataAttuale, boolean prossimi);

    Map<Integer, String> roundTennis();

    enum SportDisponibili {
        CALCIO, BASKET, TENNIS
    }

    enum CampionatiDisponibili {
        SERIE_A,
        SERIE_B,
        LIGA,
        TENNIS_WIMBLEDON,
        TENNIS_AO,
        NBA_RS;
    }

}
