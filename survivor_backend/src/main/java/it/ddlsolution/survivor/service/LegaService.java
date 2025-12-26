package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.aspect.LoggaDispositiva;
import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.mapper.LegaMapper;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LegaService {
    private final LegaRepository legaRepository;
    private final LegaMapper legaMapper;
    private final ICalendario calendario;
    private final CacheableService cacheableService;


    public List<LegaDTO> mieLeghe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        List<LegaDTO> legheDTO = legheUser(userId);
        return legheDTO;
    }

    public List<LegaDTO> legheUser(Long userId) {
        List<Lega> leghe = legaRepository.findByGiocatoreLeghe_Giocatore_User_Id(userId);
        List<LegaDTO> legheDTO = new ArrayList<>();
        for (Lega lega : leghe) {
            legheDTO.add(getLegaDTO(lega.getId(), false));
        }
        return legheDTO;
    }

    public LegaDTO getLegaDTO(Long id, boolean completo) {
        LegaDTO legaDTO;
        if (completo) {
            legaDTO = legaRepository.findById(id)
                    .map(legaMapper::toDTO)
                    .orElseThrow(() -> new RuntimeException("Lega non trovata: " + id));
        } else {
            legaDTO = legaRepository.findProjectionById(id)
                    .map(legaMapper::toDTO)
                    .orElseThrow(() -> new RuntimeException("Lega non trovata: " + id));
        }

        addInfoCalcolate(legaDTO);
        List<GiocatoreDTO> giocatori = legaDTO.getGiocatori();
        if (!ObjectUtils.isEmpty(giocatori)) {
            giocatori = giocatori.stream().sorted((g1, g2) ->
            {
                Enumeratori.StatoGiocatore statoGiocatore1 = g1.getStatiPerLega().entrySet().stream().filter(e -> e.getKey().equals(legaDTO.getId())).findFirst().get().getValue();
                Enumeratori.StatoGiocatore statoGiocatore2 = g2.getStatiPerLega().entrySet().stream().filter(e -> e.getKey().equals(legaDTO.getId())).findFirst().get().getValue();
                if (statoGiocatore1 == statoGiocatore2) {
                    if (g1.getGiocate().size() == g2.getGiocate().size()) {
                        return g1.getNome().compareTo(g2.getNome());
                    }
                    return g2.getGiocate().size() - g1.getGiocate().size();
                }
                return statoGiocatore1.ordinal() - statoGiocatore2.ordinal();
            }).toList();
            legaDTO.setGiocatori(giocatori);
        }
        return legaDTO;
    }


    public LegaDTO salva(LegaDTO legaDTO) {
        // Carica l'entità esistente dal database
        Lega lega = legaRepository.findById(legaDTO.getId())
                .orElseThrow(() -> new RuntimeException("Lega non trovata: " + legaDTO.getId()));

        // Aggiorna solo i campi modificabili
        lega.setGiornataCalcolata(legaDTO.getGiornataCalcolata());

        // Aggiorna gli stati dei giocatori e le loro giocate
        if (legaDTO.getGiocatori() != null) {
            for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
                // Trova la relazione GiocatoreLega esistente
                lega.getGiocatoreLeghe().stream()
                        .filter(gl -> gl.getGiocatore().getId().equals(giocatoreDTO.getId()))
                        .findFirst()
                        .ifPresent(gl -> {
                            // Aggiorna lo stato del giocatore nella lega
                            Enumeratori.StatoGiocatore nuovoStato = giocatoreDTO.getStatiPerLega().get(legaDTO.getId());
                            if (nuovoStato != null) {
                                gl.setStato(nuovoStato);
                            }

                            // Aggiorna le giocate del giocatore (esito OK/KO)
                            if (giocatoreDTO.getGiocate() != null) {
                                for (GiocataDTO giocataDTO : giocatoreDTO.getGiocate()) {
                                    // Trova la giocata corrispondente nell'entità
                                    gl.getGiocatore().getGiocate().stream()
                                            .filter(g -> g.getId() != null && g.getId().equals(giocataDTO.getId()))
                                            .findFirst()
                                            .ifPresent(giocata -> {
                                                // Aggiorna l'esito se è cambiato
                                                if (giocataDTO.getEsito() != null) {
                                                    giocata.setEsito(giocataDTO.getEsito());
                                                }
                                            });
                                }
                            }
                        });
            }
        }

        // Salva e ritorna
        return legaMapper.toDTO(legaRepository.save(lega));
    }


    public Enumeratori.StatoPartita statoGiornata(LegaDTO legaDTO, int giornata) {
        List<PartitaDTO> partite = calendario.partite(legaDTO.getCampionato().getSport().getId(), legaDTO.getCampionato().getId(), giornata);
        return statoGiornata(partite, giornata, legaDTO);
    }

    private Enumeratori.StatoPartita statoGiornata(List<PartitaDTO> partite, int giornata, LegaDTO legaDTO) {
        List<Integer> listaSospensioni = cacheableService.allSospensioni().getOrDefault(legaDTO.getId(), new ArrayList<>());
        Enumeratori.StatoPartita statoPartita;
        if (listaSospensioni.contains(giornata)) {    
            statoPartita = Enumeratori.StatoPartita.SOSPESA;
        } else {
            statoPartita = statoGiornata(partite, giornata);
        }
        return statoPartita;
    }

    private Enumeratori.StatoPartita statoGiornata(List<PartitaDTO> partite, int giornata) {
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


    @LoggaDispositiva(tipologia = "calcola")
    public LegaDTO calcola(Long idLega, int giornataDaCalcolare) {
        log.info("CALCOLA");

        LegaDTO legaDTO = getLegaDTO(idLega, true);
        List<PartitaDTO> partite = calendario.partite(legaDTO.getCampionato().getSport().getId(), legaDTO.getCampionato().getId(), giornataDaCalcolare);
        final int giornataIniziale = legaDTO.getGiornataIniziale();
        Enumeratori.StatoPartita stato = statoGiornata(partite, giornataDaCalcolare, legaDTO);
        if (stato != Enumeratori.StatoPartita.DA_GIOCARE) {
            if (stato == Enumeratori.StatoPartita.SOSPESA) {
                legaDTO.setGiornataCalcolata(giornataDaCalcolare);
            } else {
                for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
                    Enumeratori.StatoGiocatore statoGiocatore = giocatoreDTO.getStatiPerLega().get(idLega);
                    if (statoGiocatore != Enumeratori.StatoGiocatore.ELIMINATO) {
                        List<GiocataDTO> giocate = giocatoreDTO
                                .getGiocate()
                                .stream().sorted(Comparator.comparing(GiocataDTO::getGiornata))
                                .filter(g -> g.getGiornata() + giornataIniziale - 1 == giornataDaCalcolare)
                                .toList();
                        Boolean vincente = null;
                        if (giocate.size() == 0) {
                            vincente = false;
                        } else if (giocate.size() == 1) {
                            GiocataDTO giocataDTO = giocate.get(0);
                            vincente = vincente(giocataDTO.getSquadraSigla(), partite);
                            if (vincente != null) {
                                if (vincente) {
                                    giocataDTO.setEsito(Enumeratori.EsitoGiocata.OK);
                                } else {
                                    giocataDTO.setEsito(Enumeratori.EsitoGiocata.KO);
                                }
                            }
                        }
                        if (vincente != null && vincente == false) {
                            giocatoreDTO.getStatiPerLega().put(idLega, Enumeratori.StatoGiocatore.ELIMINATO);
                        }

                    }
                }
                if (stato == Enumeratori.StatoPartita.TERMINATA) {
                    legaDTO.setGiornataCalcolata(giornataDaCalcolare);
                }
            }
        }
        salva(legaDTO);
        return getLegaDTO(legaDTO.getId(), true);
    }


    private Boolean vincente(String squadraSigla, List<PartitaDTO> partite) {
        Boolean ret = null;
        PartitaDTO partitaDTO = partite
                .stream()
                .filter(p -> p.getCasaSigla().equals(squadraSigla) || p.getFuoriSigla().equals(squadraSigla))
                .sorted(Comparator.comparing(PartitaDTO::getOrario))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Nessuna partita di " + squadraSigla + " non trovata"));

        if (partitaDTO.getStato() == Enumeratori.StatoPartita.TERMINATA) {
            String casa = partitaDTO.getCasaSigla();
            String fuori = partitaDTO.getFuoriSigla();
            Integer scoreCasa = partitaDTO.getScoreCasa();
            Integer scoreFuori = partitaDTO.getScoreFuori();
            if (casa.equals(squadraSigla)) {
                if (scoreCasa > scoreFuori) {
                    ret = true;
                } else {
                    ret = false;
                }
            }
            if (fuori.equals(squadraSigla)) {
                if (scoreFuori > scoreCasa) {
                    ret = true;
                } else {
                    ret = false;
                }
            }
        }
        return ret;
    }

    private void addInfoCalcolate(LegaDTO legaDTO) {
        Integer giornataCalcolata = legaDTO.getGiornataCalcolata();
        Integer giornataCorrente = (giornataCalcolata == null ? legaDTO.getGiornataIniziale() : giornataCalcolata + 1);
        legaDTO.setGiornataCorrente(giornataCorrente);
        Map<Integer, Enumeratori.StatoPartita> statiGiornate = new HashMap<>();
        List<Integer> listaSospensioni = cacheableService.allSospensioni().getOrDefault(legaDTO.getId(), new ArrayList<>());
        for (Integer giornata = legaDTO.getGiornataIniziale(); giornata <= giornataCorrente; giornata++) {
            Enumeratori.StatoPartita statoPartita = statoGiornata(legaDTO, giornata);
            statiGiornate.put(giornata, statoPartita);
        }
        legaDTO.setStatoGiornataCorrente(statiGiornate.get(giornataCorrente));
        legaDTO.setStatiGiornate(statiGiornate);

    }


    @LoggaDispositiva(tipologia = "undoCalcola")
    public LegaDTO undoCalcola(Long idLega) {
        LegaDTO legaDTO = getLegaDTO(idLega, true);
        int giornataCorrente = legaDTO.getGiornataCorrente();
        Integer nuovaGiornata = legaDTO.getGiornataCalcolata() - 1;
        if (nuovaGiornata.compareTo(legaDTO.getGiornataIniziale()) < 0) {
            nuovaGiornata = null;
        }
        legaDTO.setGiornataCalcolata(nuovaGiornata);
        for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
            for (GiocataDTO giocataDTO : giocatoreDTO.getGiocate()) {
                if (giocataDTO.getGiornata().equals(giornataCorrente - legaDTO.getGiornataIniziale())) {
                    if (giocataDTO.getEsito() == Enumeratori.EsitoGiocata.KO) {
                        giocatoreDTO.getStatiPerLega().put(legaDTO.getId(), Enumeratori.StatoGiocatore.ATTIVO);
                    }
                    giocataDTO.setEsito(null);
                }
            }
        }

        salva(legaDTO);
        return getLegaDTO(legaDTO.getId(), true);

    }
}
