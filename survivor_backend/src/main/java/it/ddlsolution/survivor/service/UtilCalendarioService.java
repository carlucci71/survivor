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

import it.ddlsolution.survivor.dto.ClassificaRowDTO;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
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


    public List<ClassificaRowDTO> computeClassifica(CampionatoDTO campionatoDTO, short anno) {
        List<PartitaDTO> all = cacheableProvider.getIfAvailable()
                .getPartiteCampionatoAnno(campionatoDTO.getId(), anno)
                .stream()
                .filter(p -> p.getStato() == Enumeratori.StatoPartita.TERMINATA)
                .toList();

        Map<String, int[]> stats = new LinkedHashMap<>();
        Map<String, String> nomi = new LinkedHashMap<>();

        for (PartitaDTO part : all) {
            stats.computeIfAbsent(part.getCasaSigla(), k -> new int[7]);
            stats.computeIfAbsent(part.getFuoriSigla(), k -> new int[7]);
            nomi.put(part.getCasaSigla(), part.getCasaNome());
            nomi.put(part.getFuoriSigla(), part.getFuoriNome());

            int sc = part.getScoreCasa() != null ? part.getScoreCasa() : 0;
            int sf = part.getScoreFuori() != null ? part.getScoreFuori() : 0;
            int[] casa = stats.get(part.getCasaSigla());
            int[] fuori = stats.get(part.getFuoriSigla());
            // [0]=pj [1]=v [2]=n [3]=p [4]=punti [5]=gf [6]=gs
            casa[0]++; fuori[0]++;
            casa[5] += sc; casa[6] += sf;
            fuori[5] += sf; fuori[6] += sc;
            if (sc > sf) {
                casa[1]++; casa[4] += 3; fuori[3]++;
            } else if (sc < sf) {
                fuori[1]++; fuori[4] += 3; casa[3]++;
            } else {
                casa[2]++; casa[4]++; fuori[2]++; fuori[4]++;
            }
        }

        return stats.entrySet().stream()
                .map(e -> {
                    int[] s = e.getValue();
                    return ClassificaRowDTO.builder()
                            .sigla(e.getKey())
                            .nome(nomi.getOrDefault(e.getKey(), e.getKey()))
                            .pj(s[0]).v(s[1]).n(s[2]).p(s[3])
                            .punti(s[4]).gf(s[5]).gs(s[6])
                            .build();
                })
                .sorted((a, b) -> {
                    if (b.getPunti() != a.getPunti()) return b.getPunti() - a.getPunti();
                    return (b.getGf() - b.getGs()) - (a.getGf() - a.getGs());
                })
                .collect(Collectors.toList());
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
                for (PartitaDTO partitaFromWeb : partiteFromWeb) {
                    //if (isFirstLoading || partitaDaRefreshare(partitaFromWeb)) {//FIXME ripristinare refresh ultime giornate
                    if (true) {
                        log.info("Aggiorno partita {} {} in stato {} in calendario {}", partitaFromWeb.getCasaSigla(), partitaFromWeb.getFuoriSigla(), partitaFromWeb.getStato(), partitaFromWeb.getOrario());
                        partiteDiCampionatoDellaGiornata.add(partitaService.aggiornaPartitaSuDB(partitaFromWeb));
                    } else {
                        partiteDiCampionatoDellaGiornata.add(partitaFromWeb);
                    }
                }
                // Invalida il cache dopo aver salvato le partite, così le letture successive
                // (es. partiteDellaGiornata, round-results-dialog) vedono i dati aggiornati.
                cacheableProvider.getIfAvailable().clearCachePartite(campionatoDTO.getId(), anno);
                log.info("Cache partite invalidata per {} anno={} dopo aggiornamento giornata {}", campionatoDTO.getId(), anno, giornata);
            }
        }
        return partiteDiCampionatoDellaGiornata;
    }

    //se almeno una partita non è terminata  o se almeno una partita si gioca nei prossimi x giorni
    private boolean partitaDaRefreshare(PartitaDTO partitaDTO) {
        return (
                (refreshTerminate || partitaDTO.getStato() != Enumeratori.StatoPartita.TERMINATA)
                        //&& partitaDTO.getOrario().compareTo(LocalDateTime.now().plusDays(7)) < 0 FIXME aggiorna solo prossimi x giorni, ma se ho tutte terminate ed una in recupero tra 1 mese non la considera
        );
    }

    public List<PartitaDTO> partiteDellaGiornata(CampionatoDTO campionatoDTO, int giornata, short anno) {
        return getPartiteDellaGiornata(campionatoDTO, giornata, anno)
                .stream()
                .sorted(Comparator.comparing(PartitaDTO::getOrario))
                .toList();
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

