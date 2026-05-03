package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.aspect.dispologger.LoggaDispositiva;
import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.UserDTO;
import it.ddlsolution.survivor.dto.VitaPersaDTO;
import it.ddlsolution.survivor.dto.request.AggiornViteDTO;
import it.ddlsolution.survivor.dto.request.GiocataRequestDTO;
import it.ddlsolution.survivor.dto.request.LegaInsertDTO;
import it.ddlsolution.survivor.dto.request.LegaJoinDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.GiocatoreLega;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.entity.VitaPersa;
import it.ddlsolution.survivor.entity.projection.LegaProjection;
import it.ddlsolution.survivor.exception.ManagedException;
import it.ddlsolution.survivor.mapper.GiocataMapper;
import it.ddlsolution.survivor.mapper.LegaMapper;
import it.ddlsolution.survivor.repository.GiocataRepository;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import it.ddlsolution.survivor.repository.LegaJoinRequestRepository;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.repository.VitaPersaRepository;
import it.ddlsolution.survivor.util.Utility;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LegaService {
    private final LegaRepository legaRepository;
    private final LegaJoinRequestRepository legaJoinRequestRepository;
    private final CampionatoService campionatoService;
    private final LegaMapper legaMapper;
    private final UtilCalendarioService utilCalendarioService;
    private final SospensioniLegaService sospensioniLegaService;
    private final GiocatoreService giocatoreService;
    private final GiocatoreLegaService giocatoreLegaService;
    private final GiocatoreRepository giocatoreRepository;
    private final UserService userService;
    private final EmailService emailService;
    private final MagicLinkService magicLinkService;
    private final Utility utility;
    private final CacheableService cacheableService;
    private final ObjectProvider<InserisciGiocataService> inserisciGiocataServiceProvider;
    private final ReactionGiocataService reactionGiocataService;
    private final GiocataRepository giocataRepository;
    private final GiocataMapper giocataMapper;
    private final VitaPersaRepository vitaPersaRepository;

    /**
     * Self-reference per invocare getLegaDTO via proxy (rispettando @Transactional NOT_SUPPORTED).
     * Senza questo, le chiamate self a getLegaDTO ignorano NOT_SUPPORTED e girano in TX1,
     * causando UnexpectedRollbackException se un'eccezione interna catturata ha già
     * marcato TX1 come rollback-only.
     */
    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.context.annotation.Lazy
    private LegaService legaServiceProxy;

    @Transactional(readOnly = true, propagation = Propagation.NOT_SUPPORTED)
    public List<LegaDTO> mieLeghe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        List<LegaDTO> legheDTO = legheUser(userId);
        return legheDTO;
    }

    @Transactional(readOnly = true)
    public List<LegaDTO> legheLibere() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        List<Lega> legheDaAvviare = legaRepository.findByStatoAndGiocatoreLeghe_Giocatore_UserNot(Enumeratori.StatoLega.DA_AVVIARE, userId);
        return legaMapper.toDTOList(legheDaAvviare)
                .stream()
                .peek(dto -> dto.setRichiesteInAttesa(
                        legaJoinRequestRepository.countByLega_IdAndStato(dto.getId(), Enumeratori.StatoRichiesta.PENDING)))
                .sorted(Comparator.comparingInt(LegaDTO::getNumPartecipanti).reversed())
                .toList();
    }

    @Transactional(readOnly = true, propagation = Propagation.NOT_SUPPORTED)
    public List<LegaDTO> legheUser(Long userId) {
        List<Lega> leghe = legaRepository.findByGiocatoreLeghe_Giocatore_User_Id(userId);
        return leghe
                .stream()
                .sorted((l1, l2) -> Long.compare(l2.getId(), l1.getId())) // Ordina per ID discendente (più recenti prima)
                .map(lega -> getLegaDTO(lega.getId(), false, userId))
                .toList();
    }

    @Transactional(readOnly = true, propagation = Propagation.NOT_SUPPORTED)
    public LegaDTO getLegaDTO(Long id, boolean completo, Long userId) {
        return doGetLegaDTO(id, completo, userId);
    }

    private LegaDTO doGetLegaDTO(Long id, boolean completo, Long userId) {
        LegaDTO legaDTO = new LegaDTO();
        try {
            if (completo) {
                legaDTO = legaRepository.findById(id)
                        .map(legaMapper::toDTO)
                        .orElseThrow(() -> new RuntimeException("Lega non trovata: " + id));
            } else {
                legaDTO = legaRepository.findProjectionById(id)
                        .map(legaMapper::toDTO)
                        .orElseThrow(() -> new RuntimeException("Lega non trovata: " + id));


                Long idLega = legaDTO.getId();

                GiocatoreDTO giocatoreDTO = giocatoreService.getMyInfoInLega(legaDTO, userId);
                giocatoreDTO.setGiocate(null);
                giocatoreDTO.setStatiPerLega(Map.of(idLega, giocatoreDTO.getStatiPerLega().get(idLega)));
                giocatoreDTO.setRuoliPerLega(Map.of(idLega, giocatoreDTO.getRuoliPerLega().get(idLega)));
                legaDTO.setGiocatori(List.of(giocatoreDTO));
                legaDTO.setNumPartecipanti(giocatoreLegaService.countByLegaId(id));

            }
            if (legaDTO.getStato() == Enumeratori.StatoLega.ERRORE) {
                calcolaStatoLega(legaDTO, null);
            }

            addInfoCalcolate(legaDTO, userId);

            // Popola la giocata corrente DOPO addInfoCalcolate (che setta giornataDaGiocare)
            if (!completo) {
                Giocatore giocatoreEntity = giocatoreRepository.findByUser_Id(userId).orElse(null);
                int giornataDaGiocare = legaDTO.getGiornataDaGiocare();
                int giornataIniziale = legaDTO.getGiornataIniziale();
                // Il frontend salva con giornata relativa: giornataDaGiocare - giornataIniziale + 1
                int giornataRelativa = giornataDaGiocare - giornataIniziale + 1;
                if (giocatoreEntity != null && giornataRelativa > 0) {
                    LegaDTO finalLegaDTO = legaDTO;
                    giocataRepository
                            .findByGiornataAndGiocatore_IdAndLega_Id(
                                    giornataRelativa,
                                    giocatoreEntity.getId(),
                                    legaDTO.getId())
                            .ifPresent(g -> finalLegaDTO.setMiaGiocataCorrente(giocataMapper.toDTO(g)));

                    // Se non c'è ancora una pick per la giornata corrente, porta l'ultimo risultato
                    // definitivo (esito OK/KO) così la home può mostrare win/loss animation.
                    if (legaDTO.getMiaGiocataCorrente() == null) {
                        giocataRepository
                                .findTopByGiocatore_IdAndLega_IdAndEsitoIsNotNullOrderByGiornataDesc(
                                        giocatoreEntity.getId(),
                                        legaDTO.getId())
                                .ifPresent(g -> finalLegaDTO.setMiaUltimaGiocataConEsito(giocataMapper.toDTO(g)));
                    }
                }
            }


            if (legaDTO.getStato() == Enumeratori.StatoLega.DA_AVVIARE && legaDTO.getStatoGiornataCorrente() != Enumeratori.StatoPartita.DA_GIOCARE) {
                legaDTO.setStato(Enumeratori.StatoLega.AVVIATA);
            }

            legaDTO.setGiocatori(getGiocatoriOrdinati(legaDTO.getGiocatori(), legaDTO.getId()));
            if (completo && legaDTO.getStatoGiornataCorrente() == Enumeratori.StatoPartita.DA_GIOCARE && userId != 0 && true) {//TODO opzione
                offuscaUltimaGiocata(legaDTO, giocatoreService.findByUserId(userId).getId());
            }

            if (legaDTO.getId() != null) {
                legaDTO.setRichiesteInAttesa(
                        legaJoinRequestRepository.countByLega_IdAndStato(legaDTO.getId(), Enumeratori.StatoRichiesta.PENDING));
            }

        } catch (Exception e) {
            log.error("Errore in info calcolate", e);
            legaDTO.setStato(Enumeratori.StatoLega.ERRORE);
        }

        // Popola reactions fuori dal try/catch principale: un errore qui non deve
        // compromettere il caricamento della lega
        if (completo && userId != 0) {
            try {
                popolaReactions(legaDTO);
            } catch (Exception e) {
                log.warn("Errore nel caricamento reactions (ignorato): {}", e.getMessage());
            }
        }

        return legaDTO;
    }

    private List<GiocatoreDTO> getGiocatoriOrdinati(List<GiocatoreDTO> giocatori, Long idLega) {
        if (!ObjectUtils.isEmpty(giocatori)) {
            giocatori = giocatori.stream().sorted((g1, g2) ->
            {
                Enumeratori.StatoGiocatore statoGiocatore1 = g1.getStatiPerLega().entrySet().stream()
                        .filter(e -> e.getKey().equals(idLega))
                        .findFirst()
                        .get()
                        .getValue();
                Enumeratori.StatoGiocatore statoGiocatore2 = g2.getStatiPerLega().entrySet().stream()
                        .filter(e -> e.getKey().equals(idLega))
                        .findFirst()
                        .get()
                        .getValue();
                if (statoGiocatore1 == statoGiocatore2) {
                    return g1.getNickname().compareTo(g2.getNickname());
                }
                return statoGiocatore1.ordinal() - statoGiocatore2.ordinal();
            }).toList();
        }
        return giocatori;
    }

    private void offuscaUltimaGiocata(LegaDTO legaDTO, Long giocatoreId) {
        List<GiocatoreDTO> giocatori = legaDTO.getGiocatori();
        Long idLega = legaDTO.getId();
        Integer giornata = legaDTO.getGiornataCorrente() - legaDTO.getGiornataIniziale() + 1;
        if (!ObjectUtils.isEmpty(giocatori)) {
            for (GiocatoreDTO giocatoreDTO : giocatori) {
                List<GiocataDTO> giocate = giocatoreDTO.getGiocate();
                for (GiocataDTO giocataDTO : giocate) {
                    if (!ObjectUtils.isEmpty(giocataDTO.getSquadraId())
                            && giocataDTO.getGiornata().equals(giornata)
                            && giocataDTO.getLegaId().equals(idLega)
                            && !giocataDTO.getGiocatoreId().equals(giocatoreId)
                            && !Boolean.TRUE.equals(giocataDTO.getPubblica()) // Non offuscare le giocate esplicitamente pubbliche
                    ) {
                        giocataDTO.setSquadraId("***");
                        giocataDTO.setSquadraSigla("***");
                    }
                }
            }
        }
    }


    @Transactional
    public LegaDTO salva(LegaDTO legaDTO, Enumeratori.StatoLega statoForzato) {
        calcolaStatoLega(legaDTO, statoForzato);

        // Carica l'entità esistente dal database
        Lega lega = legaRepository.findById(legaDTO.getId())
                .orElseThrow(() -> new RuntimeException("Lega non trovata: " + legaDTO.getId()));

        // Aggiorna solo i campi modificabili
        lega.setGiornataCalcolata(legaDTO.getGiornataCalcolata());
        lega.setGiornataFinale(legaDTO.getGiornataFinale());

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
                            if (giocatoreDTO.getPuntiTotali() != null) {
                                gl.setPuntiTotali(giocatoreDTO.getPuntiTotali());
                            }
                            // Aggiorna vite correnti se presenti nel DTO
                            Short viteCorrente = giocatoreDTO.getVitePerLega().get(legaDTO.getId());
                            if (viteCorrente != null) {
                                gl.setViteCorrente(viteCorrente);
                            }
                            if (legaDTO.getStato() != Enumeratori.StatoLega.TERMINATA) {
                                gl.setPosizioneFinale(null);
                            }
                            // Aggiorna le giocate del giocatore (esito OK/KO)
                            if (giocatoreDTO.getGiocate() != null) {
                                for (GiocataDTO giocataDTO : giocatoreDTO.getGiocate()) {
                                    // Trova la giocata corrispondente nell'entità
                                    gl.getGiocatore().getGiocate().stream()
                                            .filter(g -> g.getLega().getId().equals(lega.getId()) && g.getId() != null && g.getId().equals(giocataDTO.getId()))
                                            .findFirst()
                                            .ifPresent(giocata -> {
                                                // Aggiorna l'esito se è cambiato
                                                giocata.setEsito(giocataDTO.getEsito());
                                                giocata.setPunti(giocataDTO.getPunti());
                                            });
                                }
                            }
                        });
            }
        }
        lega.setStato(legaDTO.getStato());
        // Salva e ritorna
        return legaMapper.toDTO(legaRepository.save(lega));
    }

    @Transactional(readOnly = true)
    public List<LegaDTO> allLeghe() {
        return legaMapper.toDTOListProjection(legaRepository.allLeghe());
    }


    @Transactional(readOnly = true)
    public Enumeratori.StatoPartita statoGiornata(List<PartitaDTO> partite, int giornata, LegaDTO legaDTO) {

        List<Integer> listaSospensioni = sospensioniLegaService.allSospensioni().stream()
                .filter(s -> s.getIdLega().equals(legaDTO.getId()))
                .flatMap(s -> s.getGiornate().stream())
                .toList();
        Enumeratori.StatoPartita statoPartita;
        if (listaSospensioni.contains(giornata)) {
            statoPartita = Enumeratori.StatoPartita.SOSPESA;
        } else {
            statoPartita = statoGiornata(partite, giornata);
        }
        return statoPartita;
    }

    @Transactional(readOnly = true)
    public Enumeratori.StatoPartita statoGiornata(List<PartitaDTO> partite, int giornata) {

        //Se partita forzata la considero terminata
        for (PartitaDTO partitaDTO : partite) {
            if (Boolean.TRUE.equals(partitaDTO.getForzata())) {
                partitaDTO.setStato(Enumeratori.StatoPartita.TERMINATA);
            }
        }

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
    @Transactional
    public LegaDTO calcola(Long idLega) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        // Chiamata diretta (self-call) per evitare che NOT_SUPPORTED sospenda la TX e
        // sganci la sessione Hibernate, causando LazyInitializationException nel mapper.
        LegaDTO legaDTO = getLegaDTO(idLega, true, userId);

        if (legaDTO.getGiocatori() == null) {
            log.warn("calcola: getLegaDTO ha restituito giocatori null per lega {} (stato={})", idLega, legaDTO.getStato());
            return legaDTO;
        }
        int giocateDaCalcolare = 0;
        for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
            giocateDaCalcolare += giocatoreDTO.getGiocate().stream().filter(g -> g.getEsito() == null).count();
        }
        if ((legaDTO.getStatoGiornataCorrente() == Enumeratori.StatoPartita.TERMINATA)
                || (giocateDaCalcolare > 0 && legaDTO.getStato() != Enumeratori.StatoLega.TERMINATA)
        ) {
            CampionatoDTO campionatoDTO = campionatoService.refreshCampionato(legaDTO.getCampionato(), legaDTO.getAnno());
            legaDTO.setCampionato(campionatoDTO);
            int nuovaGiornataCalcolata = legaDTO.getGiornataCalcolata() == null ? legaDTO.getGiornataIniziale() : legaDTO.getGiornataCalcolata() + 1;
            if (nuovaGiornataCalcolata > campionatoDTO.getNumGiornate()) {
                nuovaGiornataCalcolata = campionatoDTO.getNumGiornate();
            }
            List<PartitaDTO> partite = utilCalendarioService.getPartiteDellaGiornata(campionatoDTO, nuovaGiornataCalcolata, legaDTO.getAnno());
            final int giornataIniziale = legaDTO.getGiornataIniziale();
            Enumeratori.StatoPartita statoGiornata = statoGiornata(partite, nuovaGiornataCalcolata, legaDTO);
            if (statoGiornata != Enumeratori.StatoPartita.DA_GIOCARE) {
                if (statoGiornata == Enumeratori.StatoPartita.SOSPESA) {
                    legaDTO.setGiornataCalcolata(nuovaGiornataCalcolata);
                } else {
                    if (legaDTO.getModalita() == Enumeratori.ModalitaLega.CAMPIONATO) {
                        // ── CAMPIONATO: nessuna eliminazione, accumula punti ──
                        for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
                            final Integer gc = Integer.valueOf(nuovaGiornataCalcolata);
                            List<GiocataDTO> giocate = giocatoreDTO
                                    .getGiocate()
                                    .stream().sorted(Comparator.comparing(GiocataDTO::getGiornata))
                                    .filter(g -> g.getLegaId().equals(idLega) && g.getGiornata() + giornataIniziale - 1 == gc)
                                    .toList();
                            Integer puntiRound = null;
                            if (giocate.size() == 0) {
                                // Nessuna pick: 0 punti, auto-inserisci KO
                                puntiRound = 0;
                                GiocataRequestDTO giocataRequestDTO = new GiocataRequestDTO();
                                giocataRequestDTO.setGiocatoreId(giocatoreDTO.getId());
                                giocataRequestDTO.setGiornata(nuovaGiornataCalcolata - legaDTO.getGiornataIniziale() + 1);
                                giocataRequestDTO.setLegaId(idLega);
                                giocataRequestDTO.setEsitoGiocata(Enumeratori.EsitoGiocata.KO);
                                giocataRequestDTO.setPunti(0);
                                inserisciGiocataServiceProvider.getIfAvailable().inserisciGiocata(giocataRequestDTO);
                            } else if (giocate.size() == 1) {
                                GiocataDTO giocataDTO = giocate.get(0);
                                if (giocataDTO.getEsito() == null) {
                                    puntiRound = calcolaPuntiCampionato(giocataDTO.getSquadraSigla(), partite);
                                    if (puntiRound != null) {
                                        giocataDTO.setPunti(puntiRound);
                                        if (puntiRound == 3) {
                                            giocataDTO.setEsito(Enumeratori.EsitoGiocata.OK);
                                        } else if (puntiRound == 1) {
                                            giocataDTO.setEsito(Enumeratori.EsitoGiocata.PAREGGIO);
                                        } else {
                                            giocataDTO.setEsito(Enumeratori.EsitoGiocata.KO);
                                        }
                                    }
                                }
                            }
                            if (puntiRound != null) {
                                int prevTotale = Optional.ofNullable(giocatoreDTO.getPuntiTotali()).orElse(0);
                                giocatoreDTO.setPuntiTotali(prevTotale + puntiRound);
                            }
                        }
                    } else {
                        // ── SURVIVOR: eliminazione con supporto vite ──
                        // Regole:
                        //   OK (vittoria)   → sopravvive, nessuna modifica alle vite
                        //   PAREGGIO        → consuma 1 vita se disponibile; se 0 vite → eliminato
                        //   KO (sconfitta)  → eliminato immediatamente, indipendentemente dalle vite
                        //   Nessuna pick    → trattata come KO → eliminato immediatamente
                        for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
                            Enumeratori.StatoGiocatore statoGiocatore = giocatoreDTO.getStatiPerLega().get(idLega);
                            if (statoGiocatore != Enumeratori.StatoGiocatore.ELIMINATO) {
                                final Integer gc = Integer.valueOf(nuovaGiornataCalcolata);
                                List<GiocataDTO> giocate = giocatoreDTO
                                        .getGiocate()
                                        .stream().sorted(Comparator.comparing(GiocataDTO::getGiornata))
                                        .filter(g -> g.getLegaId().equals(idLega) && g.getGiornata() + giornataIniziale - 1 == gc)
                                        .toList();
                                Enumeratori.EsitoGiocata esitoCalcolato = null;
                                if (giocate.size() == 0) {
                                    // Nessuna pick: KO diretto
                                    esitoCalcolato = Enumeratori.EsitoGiocata.KO;
                                    GiocataRequestDTO giocataRequestDTO = new GiocataRequestDTO();
                                    giocataRequestDTO.setGiocatoreId(giocatoreDTO.getId());
                                    giocataRequestDTO.setGiornata(nuovaGiornataCalcolata - legaDTO.getGiornataIniziale() + 1);
                                    giocataRequestDTO.setLegaId(idLega);
                                    giocataRequestDTO.setEsitoGiocata(Enumeratori.EsitoGiocata.KO);
                                    inserisciGiocataServiceProvider.getIfAvailable().inserisciGiocata(giocataRequestDTO);
                                } else if (giocate.size() == 1) {
                                    GiocataDTO giocataDTO = giocate.get(0);
                                    if (giocataDTO.getEsito() == null) {
                                        esitoCalcolato = calcolaEsitoSurvivor(giocataDTO.getSquadraSigla(), partite);
                                        if (esitoCalcolato != null) {
                                            giocataDTO.setEsito(esitoCalcolato);
                                        }
                                    }
                                }
                                if (esitoCalcolato == Enumeratori.EsitoGiocata.KO || esitoCalcolato == Enumeratori.EsitoGiocata.PAREGGIO) {//FIXME GESTIRE PAREGGIO
                                    // Sconfitta: eliminazione immediata indipendentemente dalle vite
                                    giocatoreDTO.getStatiPerLega().put(idLega, Enumeratori.StatoGiocatore.ELIMINATO);
                                } else if (esitoCalcolato == Enumeratori.EsitoGiocata.PAREGGIO) {
                                    // Pareggio: consuma una vita se disponibile, altrimenti eliminazione
                                    Short viteAttuali = Optional.ofNullable(
                                            giocatoreDTO.getVitePerLega().get(idLega)).orElse((short) 0);
                                    if (viteAttuali <= 0) {
                                        giocatoreDTO.getStatiPerLega().put(idLega, Enumeratori.StatoGiocatore.ELIMINATO);
                                    } else {
                                        short nuoveVite = (short) (viteAttuali - 1);
                                        giocatoreDTO.getVitePerLega().put(idLega, nuoveVite);
                                        Giocatore giocatoreEntity = giocatoreRepository.findById(giocatoreDTO.getId())
                                                .orElse(null);
                                        Lega legaEntity = legaRepository.findById(idLega).orElse(null);
                                        if (giocatoreEntity != null && legaEntity != null) {
                                            vitaPersaRepository.save(new VitaPersa(giocatoreEntity, legaEntity, nuovaGiornataCalcolata));
                                        }
                                    }
                                }
                                // esitoCalcolato == OK: nessuna azione
                            }
                        }
                    }
                    if (statoGiornata == Enumeratori.StatoPartita.TERMINATA) {
                        legaDTO.setGiornataCalcolata(nuovaGiornataCalcolata);
                    }
                }
            }
            salva(legaDTO, null);
            LegaDTO legaDTOAggiornata = getLegaDTO(idLega, true, userId);
            return legaDTOAggiornata;
        } else {
            return legaDTO;
        }
    }


    /**
     * Calcola i punti per modalità Campionato: 3 (vittoria), 1 (pareggio), 0 (sconfitta). Restituisce null se la
     * partita non è ancora terminata.
     */
    private Integer calcolaPuntiCampionato(String squadraSigla, List<PartitaDTO> partite) {
        if (squadraSigla == null) return 0;
        Optional<PartitaDTO> optPartita = partite.stream()
                .filter(p -> p.getCasaSigla().equals(squadraSigla) || p.getFuoriSigla().equals(squadraSigla))
                .sorted(Comparator.comparing(PartitaDTO::getOrario))
                .findFirst();
        if (optPartita.isEmpty()) return 0;
        PartitaDTO p = optPartita.get();
        if (p.getStato() != Enumeratori.StatoPartita.TERMINATA) return null;
        if (Boolean.TRUE.equals(p.getForzata())) return 3;
        Integer sc = p.getScoreCasa();
        Integer sf = p.getScoreFuori();
        if (sc == null || sf == null) return 0;
        if (p.getCasaSigla().equals(squadraSigla)) {
            return sc > sf ? 3 : sc.equals(sf) ? 1 : 0;
        } else {
            return sf > sc ? 3 : sf.equals(sc) ? 1 : 0;
        }
    }

    /**
     * Calcola l'esito di una giocata in modalità Survivor distinguendo vittoria, pareggio e sconfitta.
     * Restituisce null se la partita non è ancora terminata.
     */
    private Enumeratori.EsitoGiocata calcolaEsitoSurvivor(String squadraSigla, List<PartitaDTO> partite) {
        if (squadraSigla == null) return Enumeratori.EsitoGiocata.KO;
        Optional<PartitaDTO> optPartitaDTO = partite
                .stream()
                .filter(p -> p.getCasaSigla().equals(squadraSigla) || p.getFuoriSigla().equals(squadraSigla))
                .sorted(Comparator.comparing(PartitaDTO::getOrario))
                .findFirst();
        if (optPartitaDTO.isEmpty()) return Enumeratori.EsitoGiocata.KO;
        PartitaDTO partitaDTO = optPartitaDTO.get();
        if (partitaDTO.getStato() != Enumeratori.StatoPartita.TERMINATA) return null;
        if (Boolean.TRUE.equals(partitaDTO.getForzata())) return Enumeratori.EsitoGiocata.OK;
        Integer scoreCasa = partitaDTO.getScoreCasa();
        Integer scoreFuori = partitaDTO.getScoreFuori();
        if (scoreCasa == null || scoreFuori == null) return Enumeratori.EsitoGiocata.KO;
        if (scoreCasa.equals(scoreFuori)) return Enumeratori.EsitoGiocata.PAREGGIO;
        boolean isVincente = partitaDTO.getCasaSigla().equals(squadraSigla)
                ? scoreCasa > scoreFuori
                : scoreFuori > scoreCasa;
        return isVincente ? Enumeratori.EsitoGiocata.OK : Enumeratori.EsitoGiocata.KO;
    }

    private Boolean vincente(String squadraSigla, List<PartitaDTO> partite) {
        Boolean ret = null;
        Optional<PartitaDTO> optPartitaDTO = partite
                .stream()
                .filter(p -> p.getCasaSigla().equals(squadraSigla) || p.getFuoriSigla().equals(squadraSigla))
                .sorted(Comparator.comparing(PartitaDTO::getOrario))
                .findFirst();

        if (optPartitaDTO.isPresent()) {
            PartitaDTO partitaDTO = optPartitaDTO.get();
            if (partitaDTO.getStato() == Enumeratori.StatoPartita.TERMINATA) {
                if (Boolean.TRUE.equals(partitaDTO.getForzata())) {
                    ret = true;
                } else {
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
            }
        } else {
            return false;
        }
        return ret;
    }

    /**
     * Popola reactions e miaReaction su ogni GiocataDTO della lega.
     */
    private void popolaReactions(LegaDTO legaDTO) {
        if (legaDTO.getGiocatori() == null) return;
        List<Long> giocataIds = legaDTO.getGiocatori().stream()
                .filter(g -> g.getGiocate() != null)
                .flatMap(g -> g.getGiocate().stream())
                .map(GiocataDTO::getId)
                .filter(id -> id != null)
                .toList();
        if (giocataIds.isEmpty()) return;

        Map<Long, ReactionGiocataService.ReactionSummary> summary = reactionGiocataService.getReactionsSummary(giocataIds);

        legaDTO.getGiocatori().forEach(g -> {
            if (g.getGiocate() == null) return;
            g.getGiocate().forEach(giocata -> {
                if (giocata.getId() == null) return;
                ReactionGiocataService.ReactionSummary s = summary.get(giocata.getId());
                if (s != null) {
                    giocata.setReactions(s.reactions());
                    giocata.setMiaReaction(s.miaReaction());
                    giocata.setReactionAutori(s.reactionAutori());
                }
            });
        });
    }

    private void addInfoCalcolate(LegaDTO legaDTO, Long userId) {
        legaDTO.setEdizioni(legaRepository.findEdizioniByName(legaDTO.getName()).stream().sorted().toList());
        Integer giornataCalcolata = legaDTO.getGiornataCalcolata();
        Integer giornataCorrente = (giornataCalcolata == null ? legaDTO.getGiornataIniziale() : giornataCalcolata + 1);
        if (legaDTO.getCampionato().getNumGiornate() < giornataCorrente) {
            giornataCorrente = legaDTO.getCampionato().getNumGiornate();
        }
        //legaDTO.setGiornataDaGiocare(campionatoService.getCampionato(legaDTO.getCampionato().getId()).getGiornataDaGiocare());
        legaDTO.setGiornataDaGiocare(giornataCorrente);
        if (giornataCorrente > 0 && legaDTO.getCampionato().getIniziGiornate() != null
                && legaDTO.getCampionato().getIniziGiornate().size() >= giornataCorrente) {
            legaDTO.setInizioProssimaGiornata(legaDTO.getCampionato().getIniziGiornate().get(giornataCorrente - 1));
        }

        legaDTO.setGiornataCorrente(giornataCorrente);
        Map<Integer, Enumeratori.StatoPartita> statiGiornate = new HashMap<>();
        CampionatoDTO campionatoDTO = campionatoService.getCampionato(legaDTO.getCampionato().getId());
        for (Integer giornata = legaDTO.getGiornataIniziale(); giornata <= giornataCorrente; giornata++) {
            List<PartitaDTO> partiteDellaGiornata = utilCalendarioService.getPartiteDellaGiornata(campionatoDTO, giornata, legaDTO.getAnno());
            Enumeratori.StatoPartita statoGiornata = statoGiornata(partiteDellaGiornata, giornata, legaDTO);
            statiGiornate.put(giornata, statoGiornata);
        }
        legaDTO.setStatoGiornataCorrente(statiGiornate.get(giornataCorrente));
        legaDTO.setStatiGiornate(statiGiornate);

        Enumeratori.RuoloGiocatoreLega myRoleInLega = legaDTO.getGiocatori().stream()
                .filter(g -> g.getUser() != null && g.getUser().getId().equals(userId))
                .map(g -> g.getRuoliPerLega())
                .findFirst()
                .map(r -> r.get(legaDTO.getId()))
                .orElseGet(() -> Enumeratori.RuoloGiocatoreLega.NESSUNO);

        legaDTO.setRuoloGiocatoreLega(myRoleInLega);
    }


    private void calcolaStatoLega(LegaDTO legaDTO, Enumeratori.StatoLega statoForzato) {
        boolean isCampionato = legaDTO.getModalita() == Enumeratori.ModalitaLega.CAMPIONATO;
        if (statoForzato != null) {
            legaDTO.setStato(statoForzato);
            if (statoForzato != Enumeratori.StatoLega.TERMINATA && !isCampionato) {
                legaDTO.setGiornataFinale(null);
            }
        } else if ((legaDTO.getStato() == Enumeratori.StatoLega.DA_AVVIARE || legaDTO.getStato() == Enumeratori.StatoLega.ERRORE)
                && legaDTO.getStatoGiornataCorrente() != Enumeratori.StatoPartita.DA_GIOCARE) {
            legaDTO.setStato(Enumeratori.StatoLega.AVVIATA);
            if (!isCampionato) {
                legaDTO.setGiornataFinale(null);
            }
        } else if (isCampionato
                && (legaDTO.getStato() == Enumeratori.StatoLega.AVVIATA || legaDTO.getStato() == Enumeratori.StatoLega.ERRORE)
                && legaDTO.getGiornataCalcolata() != null
                && legaDTO.getGiornataFinale() != null
                && legaDTO.getGiornataCalcolata() >= legaDTO.getGiornataFinale()
        ) {
            legaDTO.setStato(Enumeratori.StatoLega.TERMINATA);
        } else if (!isCampionato
                && (legaDTO.getStato() == Enumeratori.StatoLega.AVVIATA || legaDTO.getStato() == Enumeratori.StatoLega.ERRORE)
                && legaDTO.getStatoGiornataCorrente() == Enumeratori.StatoPartita.TERMINATA
                && legaDTO.getCampionato().getNumGiornate() == legaDTO.getGiornataCorrente()
        ) {
            legaDTO.setStato(Enumeratori.StatoLega.TERMINATA);
            legaDTO.setGiornataFinale(legaDTO.getGiornataCorrente());
        } else if (!isCampionato
                && (legaDTO.getStato() == Enumeratori.StatoLega.AVVIATA || legaDTO.getStato() == Enumeratori.StatoLega.ERRORE)
                && legaDTO.getGiocatori().stream()
                .filter(g -> g.getStatiPerLega().get(legaDTO.getId()) == Enumeratori.StatoGiocatore.ATTIVO)
                .count() <= 1
        ) {
            legaDTO.setStato(Enumeratori.StatoLega.TERMINATA);
            legaDTO.setGiornataFinale(legaDTO.getGiornataCorrente());
        }
        if (legaDTO.getStato() == Enumeratori.StatoLega.TERMINATA) {
            assegnaPosizioniFinali(legaDTO);
        }
    }

    /**
     * Assegna le posizioni finali ai giocatori in base alla classifica Posizione 1 = vincitore, 2 = secondo posto,
     * etc.
     */
    private void assegnaPosizioniFinali(LegaDTO legaDTO) {
        log.info("Assegnazione posizioni finali per lega: {} - {}", legaDTO.getId(), legaDTO.getName());

        // Ordina i giocatori come nella classifica finale
        List<GiocatoreDTO> classificaFinale;
        if (legaDTO.getModalita() == Enumeratori.ModalitaLega.CAMPIONATO) {
            classificaFinale = legaDTO.getGiocatori().stream()
                    .sorted(Comparator.comparing(
                            (GiocatoreDTO g) -> Optional.ofNullable(g.getPuntiTotali()).orElse(0)
                    ).reversed())
                    .toList();
        } else {
            classificaFinale = getGiocatoriOrdinati(legaDTO.getGiocatori(), legaDTO.getId());
        }

        // Trova la lega entity
        Lega lega = legaRepository.findById(legaDTO.getId())
                .orElseThrow(() -> new RuntimeException("Lega non trovata: " + legaDTO.getId()));

        int posizione = 1;
        for (GiocatoreDTO giocatoreDTO : classificaFinale) {
            // Trova il GiocatoreLega corrispondente
            GiocatoreLega giocatoreLega = lega.getGiocatoreLeghe().stream()
                    .filter(gl -> gl.getGiocatore().getId().equals(giocatoreDTO.getId()))
                    .findFirst()
                    .orElse(null);

            if (giocatoreLega != null) {
                // Assegna posizione solo ai giocatori attivi (vincitori/sopravvissuti)
                // o con almeno una giocata (giocatori eliminati)
                Enumeratori.StatoGiocatore stato = giocatoreDTO.getStatiPerLega().get(legaDTO.getId());
                boolean haGiocate = giocatoreDTO.getGiocate() != null && !giocatoreDTO.getGiocate().isEmpty();

                if (stato == Enumeratori.StatoGiocatore.ATTIVO || haGiocate) {
                    giocatoreLega.setPosizioneFinale(posizione);
                    log.debug("Giocatore {} - Posizione: {}, Stato: {}, Giocate: {}",
                            giocatoreDTO.getNickname(), posizione, stato,
                            haGiocate ? giocatoreDTO.getGiocate().size() : 0);
                    posizione++;
                }
            }
        }

        log.info("Assegnate {} posizioni finali per lega {}", posizione - 1, legaDTO.getId());
    }

    @LoggaDispositiva(tipologia = "termina")
    @Transactional
    public LegaDTO termina(Long idLega) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        LegaDTO legaDTO = getLegaDTO(idLega, true, userId);

        // Calcola e assegna le posizioni finali prima di terminare
        assegnaPosizioniFinali(legaDTO);

        salva(legaDTO, Enumeratori.StatoLega.TERMINATA);
        return getLegaDTO(legaDTO.getId(), true, userId);
    }

    @LoggaDispositiva(tipologia = "riapri")
    @Transactional
    public LegaDTO riapri(Long idLega) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        LegaDTO legaDTO = getLegaDTO(idLega, true, userId);
        salva(legaDTO, Enumeratori.StatoLega.AVVIATA);
        return getLegaDTO(legaDTO.getId(), true, userId);
    }

    @LoggaDispositiva(tipologia = "secondaOccasione")
    @Transactional
    public LegaDTO secondaOccasione(Long idLega) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        LegaDTO legaDTO = getLegaDTO(idLega, true, userId);

        Integer giornataDaSaltare = legaDTO.getGiornataCalcolata();
        if (giornataDaSaltare == null) {
            giornataDaSaltare = 1;
        } else {
            if (legaDTO.getStatoGiornataCorrente() == Enumeratori.StatoPartita.IN_CORSO) {
                giornataDaSaltare++;
            }
        }
        sospensioniLegaService.aggiungi(idLega, giornataDaSaltare);
        legaDTO.getStatiGiornate().put(giornataDaSaltare, Enumeratori.StatoPartita.SOSPESA);

        for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
            Enumeratori.StatoGiocatore nuovoStatoGiocatore = ricalcolaStatoGiocatore(giocatoreDTO, legaDTO);
            giocatoreDTO.getStatiPerLega().put(idLega, nuovoStatoGiocatore);
//            giocatoreDTO.getStatiPerLega().put(legaDTO.getId(), Enumeratori.StatoGiocatore.ATTIVO);
        }
        salva(legaDTO, Enumeratori.StatoLega.AVVIATA);
        return getLegaDTO(legaDTO.getId(), true, userId);
    }


    @LoggaDispositiva(tipologia = "undoCalcola")
    @Transactional
    public LegaDTO undoCalcola(Long idLega) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        LegaDTO legaDTO = getLegaDTO(idLega, true, userId);
        int giornataCorrente = legaDTO.getGiornataCorrente();
        if (!ObjectUtils.isEmpty(legaDTO.getGiornataCalcolata())) {
            Integer nuovaGiornataCalcolata = legaDTO.getGiornataCalcolata() - 1;
            if (nuovaGiornataCalcolata.compareTo(legaDTO.getGiornataIniziale()) < 0) {
                nuovaGiornataCalcolata = null;
            }
            legaDTO.setGiornataCalcolata(nuovaGiornataCalcolata);
        }
        for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
            for (GiocataDTO giocataDTO : giocatoreDTO.getGiocate()) {
                //ANNULLO GIORNATA CORRENTE
                int currGG = giornataCorrente - legaDTO.getGiornataIniziale() + 1;
                if (giocataDTO.getGiornata().equals(currGG) && legaDTO.getStatiGiornate().get(currGG + legaDTO.getGiornataIniziale() - 1) != Enumeratori.StatoPartita.SOSPESA) {
                    giocataDTO.setEsito(null);
                }//ANNULLO LA PRECEDENTE SE E' L'ULTIMA
                if (legaDTO.getGiornataCalcolata() != null && legaDTO.getGiornataCalcolata() != currGG - 1) {
                    int prev = currGG - 1;
                    if (giocataDTO.getGiornata().equals(prev) && legaDTO.getStatiGiornate().get(prev + legaDTO.getGiornataIniziale() - 1) != Enumeratori.StatoPartita.SOSPESA) {
                        giocataDTO.setEsito(null);
                    }
                }//ANNULLO LA PRIMA
                if (legaDTO.getGiornataCalcolata() == null && legaDTO.getGiornataIniziale() == giornataCorrente - 1) {
                    int prev = currGG - 1;
                    if (giocataDTO.getGiornata().equals(prev) && legaDTO.getStatiGiornate().get(prev + legaDTO.getGiornataIniziale() - 1) != Enumeratori.StatoPartita.SOSPESA) {
                        giocataDTO.setEsito(null);
                    }
                }
            }

            Enumeratori.StatoGiocatore statoGiocatore = ricalcolaStatoGiocatore(giocatoreDTO, legaDTO);
            giocatoreDTO.getStatiPerLega().put(legaDTO.getId(), statoGiocatore);

        }

        salva(legaDTO, null);
        return getLegaDTO(legaDTO.getId(), true, userId);

    }

    @Transactional
    public Enumeratori.@NonNull StatoGiocatore ricalcolaStatoGiocatore(GiocatoreDTO giocatoreDTO, LegaDTO legaDTO) {
        int giornataCorrente = legaDTO.getGiornataCorrente();
        Enumeratori.StatoGiocatore statoGiocatore = Enumeratori.StatoGiocatore.ATTIVO;

        for (int gg = 1; gg < giornataCorrente - legaDTO.getGiornataIniziale() + 1; gg++) {
            final int currentGiornata = gg;

            Optional<GiocataDTO> lastGiocataCorrente = giocatoreDTO.getGiocate().stream()
                    .filter(g -> g.getLegaId().equals(legaDTO.getId()) && g.getGiornata().equals(currentGiornata))
                    .findFirst();
            if ((currentGiornata != giornataCorrente - legaDTO.getGiornataIniziale()
                    && lastGiocataCorrente.isEmpty()
                    && legaDTO.getStatiGiornate().get(legaDTO.getGiornataIniziale() + currentGiornata - 1) != Enumeratori.StatoPartita.SOSPESA
            ) ||
                    (legaDTO.getStatiGiornate().get(legaDTO.getGiornataIniziale() + currentGiornata - 1) != Enumeratori.StatoPartita.SOSPESA
                            && Enumeratori.EsitoGiocata.KO.equals(lastGiocataCorrente.orElseGet(() -> new GiocataDTO()).getEsito())
                    )
            ) {
                statoGiocatore = Enumeratori.StatoGiocatore.ELIMINATO;
            }
            gg = gg + 1;
        }
        return statoGiocatore;
    }

    @Transactional
    @LoggaDispositiva(tipologia = "inserisciLega")
    public LegaDTO inserisciLega(LegaInsertDTO legaInsertDTO) {
        if (legaRepository.findByName(legaInsertDTO.getName()).isPresent()) {
            throw new ManagedException("Nome lega già presente", ManagedException.InternalCode.CODE_LEGA_PRESENTE);
        }
        Lega lega = legaMapper.toEntity(legaInsertDTO);
        lega.setEdizione(1);
        // Se il leader ha scelto una giornata finale, la salviamo; altrimenti null (= tutto il campionato)
        if (legaInsertDTO.getGiornataFinale() != null) {
            lega.setGiornataFinale(legaInsertDTO.getGiornataFinale());
        }
        List<GiocatoreLega> giocatoriLega = new ArrayList<>();
        GiocatoreLega giocatoreLega = new GiocatoreLega();
        Giocatore giocatore = giocatoreService.findMe();
        giocatoreLega.setGiocatore(giocatore);
        giocatoreLega.setLega(lega);
        giocatoreLega.setRuolo(Enumeratori.RuoloGiocatoreLega.LEADER);
        giocatoreLega.setStato(Enumeratori.StatoGiocatore.ATTIVO);
        if (lega.getModalita() == Enumeratori.ModalitaLega.SURVIVOR) {
            giocatoreLega.setViteCorrente(legaInsertDTO.getViteIniziali() > 0 ? legaInsertDTO.getViteIniziali() : 1);
        }
        giocatoriLega.add(giocatoreLega);
        lega.setGiocatoreLeghe(giocatoriLega);
        lega.setAnno(campionatoService.getCampionato(lega.getCampionato().getId()).getAnnoCorrente());
        Lega legaSalvata = legaRepository.save(lega);
        return legaMapper.toDTO(legaSalvata);
    }

    @LoggaDispositiva(tipologia = "cancellaGiocatoreDaLega")
    @Transactional
    public LegaDTO cancellaGiocatoreDaLega(Long idLega, Long idGiocatore) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        legaRepository.deleteGiocatoreLegaByLegaIdAndGiocatoreId(idLega, idGiocatore);
        return getLegaDTO(idLega, true, userId);
    }

    @LoggaDispositiva(tipologia = "nuovaEdizione")
    @Transactional
    public LegaDTO nuovaEdizione(Long idLega) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        LegaDTO legaDTO = getLegaDTO(idLega, true, userId);
        LegaInsertDTO legaInsertDTO = new LegaInsertDTO();
        legaInsertDTO.setCampionato(legaDTO.getCampionato().getId());
        legaInsertDTO.setGiornataIniziale(legaDTO.getGiornataCorrente() + 1);
        legaInsertDTO.setName(legaDTO.getName());
        legaInsertDTO.setPwd(null);
        legaInsertDTO.setSport(legaDTO.getCampionato().getSport().getId());
        Lega lega = legaMapper.toEntity(legaInsertDTO);
        lega.setEdizione(legaDTO.getEdizione() + 1);
        lega.setStato(Enumeratori.StatoLega.DA_AVVIARE);
        List<GiocatoreLega> giocatoriLega = new ArrayList<>();
        for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
            GiocatoreLega giocatoreLega = new GiocatoreLega();
            Giocatore giocatore = giocatoreRepository.findById(giocatoreDTO.getId()).orElseThrow(() -> new RuntimeException("Giocatore non trovato: " + giocatoreDTO.getId()));
            giocatoreLega.setGiocatore(giocatore);
            giocatoreLega.setLega(lega);
            if (giocatore.getUser() != null && giocatore.getUser().getId() != null && giocatore.getUser().getId().equals(userId)) {
                giocatoreLega.setRuolo(Enumeratori.RuoloGiocatoreLega.LEADER);
            } else {
                giocatoreLega.setRuolo(Enumeratori.RuoloGiocatoreLega.GIOCATORE);
            }
            giocatoreLega.setStato(Enumeratori.StatoGiocatore.ATTIVO);
            if (lega.getModalita() == Enumeratori.ModalitaLega.SURVIVOR) {
                giocatoreLega.setViteCorrente(lega.getViteIniziali() > 0 ? lega.getViteIniziali() : 1);
            }
            giocatoriLega.add(giocatoreLega);
        }
        lega.setGiocatoreLeghe(giocatoriLega);
        Lega legaSalvata = legaRepository.save(lega);
        return legaMapper.toDTO(legaSalvata);
    }

    @Transactional
    public LegaDTO join(Long idLega, LegaJoinDTO legaJoinDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        String tokenOriginal = legaJoinDTO.getTokenOriginal();
        Lega lega = legaRepository.findById(idLega).orElseThrow(() -> new RuntimeException("Lega non trovata: " + idLega));
        if (lega.getStato() != Enumeratori.StatoLega.DA_AVVIARE) {
            throw new RuntimeException("Impossibile unirsi, la lega è già avviata");
        }

        // Se la lega richiede approvazione, il join diretto non è consentito senza token
        if (!lega.isAccessoLibero() && ObjectUtils.isEmpty(tokenOriginal)) {
            throw new ManagedException("Questa lega richiede approvazione del leader", ManagedException.InternalCode.LEGA_NOT_PUBBLICA);
        }

        if (!ObjectUtils.isEmpty(lega.getPwd())) {
            if (ObjectUtils.isEmpty(tokenOriginal) && !lega.getPwd().equals(legaJoinDTO.getPwd())) {
                throw new ManagedException("Password errata", ManagedException.InternalCode.PWD_LEGA_ERRATA);
            }
        }
        if (!ObjectUtils.isEmpty(tokenOriginal)) {
            magicLinkService.validateToken(tokenOriginal, true, Enumeratori.TipoMagicToken.JOIN.getCodice());
        }
        List<GiocatoreLega> giocatoriLega = lega.getGiocatoreLeghe();
        long count = giocatoriLega.stream()
                .filter(gl -> gl.getGiocatore().getUser() != null && gl.getGiocatore().getUser().getId() != null && gl.getGiocatore().getUser().getId().equals(userId))
                .count();
        if (count > 0) {
            throw new ManagedException("User già unito alla lega", ManagedException.InternalCode.ALREADY_JOINED);
        }

        GiocatoreLega giocatoreLega = new GiocatoreLega();
        Giocatore giocatore = giocatoreService.findMe();
        giocatoreLega.setGiocatore(giocatore);
        giocatoreLega.setLega(lega);
        giocatoreLega.setRuolo(Enumeratori.RuoloGiocatoreLega.GIOCATORE);
        giocatoreLega.setStato(Enumeratori.StatoGiocatore.ATTIVO);
        if (lega.getModalita() == Enumeratori.ModalitaLega.SURVIVOR) {
            giocatoreLega.setViteCorrente(lega.getViteIniziali() > 0 ? lega.getViteIniziali() : 1);
        }
        giocatoriLega.add(giocatoreLega);
        lega.setGiocatoreLeghe(giocatoriLega);
        Lega legaSalvata = legaRepository.save(lega);
        return legaMapper.toDTO(legaSalvata);
    }


    @Transactional
    public void invita(long idLega, List<String> emails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        for (String email : emails) {
            LegaDTO legaDTO = getLegaDTO(idLega, false, userId);
            if (legaDTO.getStato() != Enumeratori.StatoLega.DA_AVVIARE) {
                throw new RuntimeException("Impossibile invitare qualcuno, la lega è già avviata");
            }
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("L'email è obbligatoria");
            }
            if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                throw new IllegalArgumentException("Formato email non valido");
            }

            User user = userService.findByEmail(email);
            // Genera un nuovo token
            int expirationDays = 3;
            String token = magicLinkService.salvaMagicToken(user, null, expirationDays, Enumeratori.TipoMagicToken.JOIN.getCodice(), Enumeratori.TipoMagicToken.JOIN + ":" + legaDTO.getId().toString());
            String subject = "Invito per giocare a Survivor";
            String magicLink = magicLinkService.getUrlMagicLinkInvita(token, Enumeratori.TipoMagicToken.JOIN.getCodice());
            emailService.send(email, subject, buildEmailContent(magicLink, expirationDays, legaDTO));
            log.info("Magic link inviato a: {}", email);
        }
    }

    private String buildEmailContent(String magicLink, int expirationDays, LegaDTO legaDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        UserDTO userDTO = userService.userById(userId);
        return """
                Ciao,
                
                Sei stato invitato alla lega %s da %s
                Clicca sul link seguente per accedere a Survivor:
                %s
                
                Questo link è valido per %d giorni.
                
                Se non sei interessato, ignora questa email.
                
                Saluti,
                Il team di Survivor
                """.formatted(legaDTO.getName(), userDTO.getEmail(), magicLink, expirationDays);
    }

    @Transactional
    public Lega findByIdEntity(Long legaId) {
        return legaRepository.findById(legaId)
                .orElseThrow(() -> new IllegalArgumentException("Lega non trovata"));

    }

    @Transactional
    @LoggaDispositiva
    public void eliminaLega(Long idLega) {
        Lega lega = legaRepository.findById(idLega)
                .orElseThrow(() -> new ManagedException("Lega non trovata", ManagedException.InternalCode.LEGA_NOT_FOUND));

        // Verifica che l'utente corrente sia il leader della lega
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        Optional<GiocatoreLega> giocatoreLega = giocatoreLegaService.findByLega_IdAndGiocatore_User_Id(idLega, userId);
        if (giocatoreLega.isEmpty() || giocatoreLega.get().getRuolo() != Enumeratori.RuoloGiocatoreLega.LEADER) {
            throw new ManagedException("Solo il leader della lega può eliminarla", ManagedException.InternalCode.NOT_LEADER);
        }

        // Elimina la lega (cascade eliminerà giocatoreLeghe e giocate)
        legaRepository.delete(lega);
        log.info("Lega {} eliminata con successo dall'utente {}", idLega, userId);
    }

    @Transactional(readOnly = true)
    public List<LegaDTO> legheByCampionato(String idCampionato, short anno) {
        return legaMapper.toDTOList(legaRepository.findByCampionato_IdAndAnnoAndStatoIn(idCampionato, anno, List.of(Enumeratori.StatoLega.AVVIATA, Enumeratori.StatoLega.DA_AVVIARE)));
    }

    @Transactional
    public LegaDTO aggiornVite(Long idLega, AggiornViteDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        Lega lega = legaRepository.findById(idLega)
                .orElseThrow(() -> new RuntimeException("Lega non trovata: " + idLega));
        if (lega.getModalita() != Enumeratori.ModalitaLega.SURVIVOR) {
            throw new ManagedException("Le vite sono disponibili solo in modalità SURVIVOR", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA);
        }
        GiocatoreLega gl = lega.getGiocatoreLeghe().stream()
                .filter(g -> g.getGiocatore().getId().equals(dto.getIdGiocatore()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Giocatore non trovato nella lega"));
        gl.setViteCorrente(dto.getVite());
        legaRepository.save(lega);
        return getLegaDTO(idLega, true, userId);
    }

    @Transactional(readOnly = true)
    public List<VitaPersaDTO> storicoVite(Long idLega) {
        return vitaPersaRepository.findByLega_IdOrderByGiornataAscGiocatore_IdAsc(idLega)
                .stream()
                .map(v -> {
                    VitaPersaDTO dto = new VitaPersaDTO();
                    dto.setId(v.getId());
                    dto.setIdGiocatore(v.getGiocatore().getId());
                    dto.setNicknameGiocatore(v.getGiocatore().getNickname());
                    dto.setIdLega(v.getLega().getId());
                    dto.setGiornata(v.getGiornata());
                    dto.setPersaAt(v.getPersaAt());
                    return dto;
                })
                .toList();
    }

}
