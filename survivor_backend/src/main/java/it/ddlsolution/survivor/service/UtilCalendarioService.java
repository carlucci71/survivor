package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${REFRESH_TERMINATE:false}")
    private boolean refreshTerminate;

    private final ObjectProvider<ICalendario> calendarioProvider;
    private final ObjectProvider<CacheableService> cacheableProvider;
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

    public void refreshPartite(CampionatoDTO campionatoDTO, short anno) {
        cacheableProvider.getIfAvailable().clearCachePartite(campionatoDTO.getId(), anno);
        cacheableProvider.getIfAvailable().getPartiteCampionatoAnno(campionatoDTO.getId(), anno);
    }


    public List<PartitaDTO> partite(CampionatoDTO campionatoDTO, short anno) {
        List<PartitaDTO> ret = new ArrayList<>();
        for (int giornata = 1; giornata <= campionatoDTO.getNumGiornate(); giornata++) {
            ret.addAll(getPartiteDellaGiornata(campionatoDTO, giornata, anno));
        }
        return ret;
    }

    public List<PartitaDTO> getPartiteDellaGiornata(CampionatoDTO campionatoDTO, int giornata, short anno) {
        return getPartiteCampionatoGiornataAnno(campionatoDTO.getId(), giornata, anno);
    }

    public List<PartitaDTO> getPartiteCampionatoGiornataAnno(String idCampionato, int giornata, short anno) {
        List<PartitaDTO> partite = cacheableProvider.getIfAvailable().getPartiteCampionatoAnno(idCampionato, anno);
        return partite
                .stream()
                .filter(p -> p.getGiornata() == giornata)
                .toList();
    }


    public List<PartitaDTO> partiteCampionatoDellaGiornataWithRefreshFromWeb(
            CampionatoDTO campionatoDTO
            , int giornata
            , short anno) {
        List<PartitaDTO> partiteDiCampionatoDellaGiornata = getPartiteCampionatoGiornataAnno(campionatoDTO.getId(), giornata, anno);

        long partiteNotTerminate = partiteDiCampionatoDellaGiornata
                .stream()
                .filter(p -> partitaDaRefreshare(p))
                .count();
        boolean isFirstLoading = false;
        if (partiteDiCampionatoDellaGiornata.size() == 0) {
            isFirstLoading = true;
        }
        if (isFirstLoading || partiteNotTerminate > 0) {
            //cacheableProvider.getIfAvailable().invalidaPartiteFromDb(campionatoDTO.getId(),anno,giornata);
            partiteDiCampionatoDellaGiornata = new ArrayList<>();
            List<PartitaDTO> partiteFromWeb = calendarioProvider.getIfAvailable().getPartite(
                    campionatoDTO
                    , giornata
                    , anno);
            if (partiteFromWeb.size() > 0) {
                log.info("Aggiorno giornata {} di {}", giornata, campionatoDTO.getNome());
                for (PartitaDTO partitaDTO : partiteFromWeb) {
                    //if (isFirstLoading || partitaDaRefreshare(partitaDTO)) {//FIXME
                    if (true) {
                        log.info("Aggiorno partita {} {} in stato {} in calendario {}", partitaDTO.getCasaSigla(), partitaDTO.getFuoriSigla(), partitaDTO.getStato(), partitaDTO.getOrario());
                        partiteDiCampionatoDellaGiornata.add(partitaService.aggiornaPartitaSuDB(partitaDTO));
                    } else {
                        partiteDiCampionatoDellaGiornata.add(partitaDTO);
                    }
                }
            }
        }
        return partiteDiCampionatoDellaGiornata;
    }

    //se almeno una partita non è terminata  o se almeno una partita si gioca nei prossimi x giorni
    private boolean partitaDaRefreshare(PartitaDTO partitaDTO) {
        return (
                (refreshTerminate || partitaDTO.getStato() != Enumeratori.StatoPartita.TERMINATA)
                        && partitaDTO.getOrario().compareTo(LocalDateTime.now().plusDays(2)) < 0
        );
    }

    public List<PartitaDTO> calendario(CampionatoDTO campionatoDTO, String squadra, int giornataAttuale, boolean prossimi, short anno) {
        List<PartitaDTO> partite = new ArrayList<>();
        if (prossimi) {
            for (int g = giornataAttuale; g < giornataAttuale + 20; g++) {
                if (g <= campionatoDTO.getNumGiornate()) {
                    partite.addAll(addPartiteDellaGiornata(campionatoDTO, squadra, g, anno));
                }
            }
        } else {
            for (int g = giornataAttuale; g >= giornataAttuale - 20; g--) {
                if (g > 0) {
                    partite.addAll(addPartiteDellaGiornata(campionatoDTO, squadra, g, anno).reversed());
                }
            }
        }
        return partite;
    }

    private List<PartitaDTO> addPartiteDellaGiornata(CampionatoDTO campionatoDTO, String squadra, int giornata, short anno) {
        return getPartiteDellaGiornata(campionatoDTO, giornata, anno)
                .stream()
                .filter(p -> p.getCasaSigla().equals(squadra) || p.getFuoriSigla().equals(squadra))
                .sorted(Comparator.comparing(PartitaDTO::getOrario))
                .toList();
    }


}

