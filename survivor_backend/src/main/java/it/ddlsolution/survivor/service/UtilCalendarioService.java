package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UtilCalendarioService {

    private final ObjectProvider<ICalendario> calendarioProvider;

    @Transactional(readOnly = true)
    public Enumeratori.StatoPartita statoGiornata(List<PartitaDTO> partite, int giornata) {
        Map<Enumeratori.StatoPartita, Long> mappa = partite.stream()
                .collect(Collectors.groupingBy(PartitaDTO::getStato, Collectors.counting()));

        int totalePartite = mappa.values().stream().mapToInt(Long::intValue).sum();
        int daGiocare = 0;
        int terminati = 0;
        int inCorso = 0;

        if (mappa.get(Enumeratori.StatoPartita.DA_GIOCARE) != null && mappa.get(Enumeratori.StatoPartita.DA_GIOCARE) > 0) {
            daGiocare = mappa.get(Enumeratori.StatoPartita.DA_GIOCARE).intValue();
        }
        if (mappa.get(Enumeratori.StatoPartita.IN_CORSO) != null && mappa.get(Enumeratori.StatoPartita.IN_CORSO) > 0) {
            inCorso = mappa.get(Enumeratori.StatoPartita.IN_CORSO).intValue();
        }
        if (mappa.get(Enumeratori.StatoPartita.TERMINATA) != null && mappa.get(Enumeratori.StatoPartita.TERMINATA) > 0) {
            terminati = mappa.get(Enumeratori.StatoPartita.TERMINATA).intValue();
        }

        Enumeratori.StatoPartita ret = null;

        if (daGiocare == totalePartite) {
            ret = Enumeratori.StatoPartita.DA_GIOCARE;
        } else if (terminati == totalePartite) {
            ret = Enumeratori.StatoPartita.TERMINATA;
        } else if (terminati > 0 || inCorso > 0) {
            ret = Enumeratori.StatoPartita.IN_CORSO;
        }
        if (ret == null) {
            throw new RuntimeException("Impossibile calcolare lo stato della giornata: " + giornata);
        }
        return ret;
    }

    public List<PartitaDTO> partite(CampionatoDTO campionatoDTO) {
        ICalendario calendario = calendarioProvider.getIfAvailable();

        List<PartitaDTO> ret = new ArrayList<>();
        for (int giornata = 1; giornata <= campionatoDTO.getNumGiornate(); giornata++) {
            ret.addAll(calendario.getPartite(campionatoDTO.getSport().getId(), campionatoDTO.getId(), giornata));
        }
        return ret;
    }

    public List<PartitaDTO> partite(String sport, String campionato, int giornata) {
        ICalendario calendario = calendarioProvider.getIfAvailable();
        return calendario.getPartite(sport, campionato, giornata);
    }

    public List<PartitaDTO> calendario(CampionatoDTO campionatoDTO, String squadra, int giornataAttuale, boolean prossimi) {
        List<PartitaDTO> partite = new ArrayList<>();
        if (prossimi){
            for (int g = giornataAttuale; g < giornataAttuale + 20; g++) {
                if (g <= campionatoDTO.getNumGiornate()) {
                    partite.addAll(
                            partite(campionatoDTO.getSport().getId(), campionatoDTO.getId(), g)
                                    .stream()
                                    .filter(p -> p.getCasaSigla().equals(squadra) || p.getFuoriSigla().equals(squadra))
                                    .sorted(Comparator.comparing(PartitaDTO::getOrario))
                                    .toList()
                    );
                }
            }
        } else {
            for (int g = giornataAttuale; g >= giornataAttuale - 20; g--) {
                if (g > 0) {
                    partite.addAll(
                            partite(campionatoDTO.getSport().getId(), campionatoDTO.getId(), g)
                                    .stream()
                                    .filter(p -> p.getCasaSigla().equals(squadra) || p.getFuoriSigla().equals(squadra))
                                    .sorted(Comparator.comparing(PartitaDTO::getOrario))
                                    .toList().reversed()
                    );
                }
            }
        }
        return partite;
    }



}

