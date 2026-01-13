package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UtilCalendarioService {

    private final ObjectProvider<ICalendario> calendarioProvider;
    private final PartitaService partitaService;

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
        List<PartitaDTO> ret = new ArrayList<>();
        for (int giornata = 1; giornata <= campionatoDTO.getNumGiornate(); giornata++) {
            ret.addAll(getPartiteFromDb(campionatoDTO, giornata));
        }
        return ret;
    }

    public List<PartitaDTO> partiteWithRefreshFromWeb(CampionatoDTO campionatoDTO, int giornata, List<PartitaDTO> partiteDiCampionato) {
        List<PartitaDTO> partite = partiteDiCampionato
                .stream()
                .filter(p->p.getGiornata()==giornata)
                .toList();
        long partiteNotTerminate = partite
                .stream()
                //Se almeno una partita non è terminata richiamo le API
                .filter(p -> p.getStato() != Enumeratori.StatoPartita.TERMINATA)
                //Se almeno una partita si gioca nei prossimi 10 giorni
                .filter(p->p.getOrario().compareTo(LocalDateTime.now().plusDays(10))<0)
                .count();
        if (partiteNotTerminate>0) {
            log.info("Aggiorno giornata {} di {}", giornata, campionatoDTO.getId());
            List<PartitaDTO> partiteFromWeb = getPartiteAdapted(campionatoDTO, giornata);
            partite=new ArrayList<>();
            for (PartitaDTO partitaDTO : partiteFromWeb) {
                partite.add(partitaService.salvaSeNonTerminata(partitaDTO));
            }
        }
        return partite;
    }
    public List<PartitaDTO> getPartiteFromDb(CampionatoDTO campionatoDTO, int giornata) {
        return partitaService.getPartiteFromDb(campionatoDTO.getId(),giornata);
    }

    public List<PartitaDTO> getPartiteFromDb(CampionatoDTO campionatoDTO) {
        return partitaService.getPartiteFromDb(campionatoDTO.getId());
    }

    private List<PartitaDTO> getPartiteAdapted(CampionatoDTO campionatoDTO, int giornata) {
        ICalendario calendario = calendarioProvider.getIfAvailable();
        return calendario.getPartite(campionatoDTO.getSport().getId(), campionatoDTO.getId(), giornata, campionatoDTO.getSquadre());
    }

    public List<PartitaDTO> calendario(CampionatoDTO campionatoDTO, String squadra, int giornataAttuale, boolean prossimi) {
        List<PartitaDTO> partite = new ArrayList<>();
        if (prossimi) {
            for (int g = giornataAttuale; g < giornataAttuale + 20; g++) {
                if (g <= campionatoDTO.getNumGiornate()) {
                    partite.addAll(addPartiteDellaGiornata(campionatoDTO, squadra, g));
                }
            }
        } else {
            for (int g = giornataAttuale; g >= giornataAttuale - 20; g--) {
                if (g > 0) {
                    partite.addAll(addPartiteDellaGiornata(campionatoDTO, squadra, g).reversed());
                }
            }
        }
        return partite;
    }

    private List<PartitaDTO> addPartiteDellaGiornata(CampionatoDTO campionatoDTO, String squadra, int giornata) {
        return getPartiteFromDb(campionatoDTO, giornata)
                .stream()
                .filter(p -> p.getCasaSigla().equals(squadra) || p.getFuoriSigla().equals(squadra))
                .sorted(Comparator.comparing(PartitaDTO::getOrario))
                .toList();
    }


}

