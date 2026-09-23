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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
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
    private final PushNotificationService pushNotificationService;
    private final NotificationI18nService notificationI18nService;

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
        // Early exit: se in modalità survivor rimane ≤ 1 giocatore attivo, termina la lega subito
        // senza avanzare il round né inserire pick automatici (il vincitore è già noto).
        boolean isSurvivorDaTerminare = legaDTO.getModalita() != Enumeratori.ModalitaLega.CAMPIONATO
                && legaDTO.getStato() != Enumeratori.StatoLega.TERMINATA
                && legaDTO.getGiocatori().stream()
                        .filter(g -> g.getStatiPerLega().get(idLega) == Enumeratori.StatoGiocatore.ATTIVO)
                        .count() <= 1;
        if (isSurvivorDaTerminare) {
            salva(legaDTO, null);
            return getLegaDTO(idLega, true, userId);
        }
        int giocateDaCalcolare = 0;
        for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
            giocateDaCalcolare += giocatoreDTO.getGiocate().stream().filter(g -> g.getEsito() == null).count();
        }
        // Terzo caso: il round è IN_CORSO (es. tennis con partite Cancelled che bloccano TERMINATA)
        // ma tutte le giocate dei partecipanti hanno già un esito e giornataCalcolata non è ancora avanzata.
        final int giornataCorrenteCheck = legaDTO.getGiornataCorrente();
        final int giornataInizialeCheck = legaDTO.getGiornataIniziale();
        List<GiocataDTO> giocateRoundCorrente = legaDTO.getGiocatori().stream()
                .flatMap(g -> g.getGiocate().stream()
                        .filter(gg -> gg.getLegaId().equals(idLega) && gg.getGiornata() + giornataInizialeCheck - 1 == giornataCorrenteCheck))
                .collect(Collectors.toList());
        boolean giornataAncoraNoCalcolata = legaDTO.getGiornataCalcolata() == null
                || legaDTO.getGiornataCalcolata() < legaDTO.getGiornataCorrente();
        boolean tuttiRisoltiPerAvanzamento = !giocateRoundCorrente.isEmpty()
                && giocateRoundCorrente.stream().allMatch(gg -> gg.getEsito() != null)
                && giornataAncoraNoCalcolata
                && legaDTO.getStato() != Enumeratori.StatoLega.TERMINATA;
        log.info("calcola lega={} statoGiornataCorrente={} giocateDaCalcolare={} stato={} tuttiRisolti={} giornataCalcolata={} giornataCorrente={}",
                idLega, legaDTO.getStatoGiornataCorrente(), giocateDaCalcolare, legaDTO.getStato(), tuttiRisoltiPerAvanzamento,
                legaDTO.getGiornataCalcolata(), legaDTO.getGiornataCorrente());
        if ((legaDTO.getStatoGiornataCorrente() == Enumeratori.StatoPartita.TERMINATA)
                || (giocateDaCalcolare > 0 && legaDTO.getStato() != Enumeratori.StatoLega.TERMINATA)
                || tuttiRisoltiPerAvanzamento
        ) {
            CampionatoDTO campionatoDTO = campionatoService.refreshCampionato(legaDTO.getCampionato(), legaDTO.getAnno());
            legaDTO.setCampionato(campionatoDTO);
            int nuovaGiornataCalcolata = legaDTO.getGiornataCalcolata() == null ? legaDTO.getGiornataIniziale() : legaDTO.getGiornataCalcolata() + 1;
            if (nuovaGiornataCalcolata > campionatoDTO.getNumGiornate()) {
                nuovaGiornataCalcolata = campionatoDTO.getNumGiornate();
            }
            // Rispetta il numero massimo di turni scelto dal creatore della lega (anche in Survivor)
            if (legaDTO.getGiornataFinale() != null && nuovaGiornataCalcolata > legaDTO.getGiornataFinale()) {
                nuovaGiornataCalcolata = legaDTO.getGiornataFinale();
            }
            List<PartitaDTO> partite = utilCalendarioService.getPartiteDellaGiornata(campionatoDTO, nuovaGiornataCalcolata, legaDTO.getAnno());
            final int giornataIniziale = legaDTO.getGiornataIniziale();
            final boolean settimanaMultiPartita = isSettimanaMultiPartita(campionatoDTO);
            Enumeratori.StatoPartita statoGiornata = statoGiornata(partite, nuovaGiornataCalcolata, legaDTO);
            log.info("calcola lega={}: nuovaGiornataCalcolata={} partiteCaricate={} statoGiornata={}",
                    idLega, nuovaGiornataCalcolata, partite.size(), statoGiornata);
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
                                inserisciGiocataServiceProvider.getIfAvailable().inserisciGiocataDiSistema(giocataRequestDTO);
                            } else if (giocate.size() == 1) {
                                GiocataDTO giocataDTO = giocate.get(0);
                                if (giocataDTO.getEsito() == null) {
                                    if (settimanaMultiPartita) {
                                        // NBA: punti sommati su tutte le partite. L'esito qui è solo estetico (colora la
                                        // giocata nel calendario/recap) e va quindi ricavato dai punti stessi — non dal
                                        // bilancio vittorie/sconfitte usato in Survivor per decidere l'eliminazione, che
                                        // può disaccordarsi dai punti (es. 1 vittoria larga e 3 sconfitte di poco fanno
                                        // KO per bilancio ma già 3 punti: mostrerebbe un rosso "sconfitta" accanto a un
                                        // punteggio positivo).
                                        puntiRound = calcolaPuntiCampionatoSettimana(giocataDTO.getSquadraSigla(), partite);
                                        if (puntiRound != null) {
                                            giocataDTO.setPunti(puntiRound);
                                            giocataDTO.setEsito(calcolaEsitoCampionatoSettimana(puntiRound, giocataDTO.getSquadraSigla(), partite));
                                        }
                                    } else {
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
                            }
                            // Totale ricalcolato dalle giocate, non incrementale: si auto-corregge
                            // anche se in passato il totale e' andato fuori sincrono
                            giocatoreDTO.setPuntiTotali(sommaPuntiGiocate(giocatoreDTO));
                        }
                    } else {
                        // ── SURVIVOR: eliminazione con supporto vite ──
                        // Regole:
                        //   OK (vittoria)   → sopravvive, nessuna modifica alle vite
                        //   PAREGGIO        → consuma 1 vita se disponibile; se 0 vite → eliminato
                        //   KO (sconfitta)  → eliminato immediatamente, indipendentemente dalle vite
                        //   Nessuna pick    → trattata come KO → eliminato immediatamente
                        //   Eccezione NBA: il KO di una scelta effettivamente giocata (non di chi non
                        //   ha fatto pick) consuma una vita come il pareggio — vedi consumaVita().
                        //
                        // Le eliminazioni vengono APPLICATE solo quando l'esito di TUTTI i giocatori
                        // ancora attivi per questo turno è noto (partite di tutti terminate): altrimenti
                        // si rischia di dichiarare un vincitore/eliminare qualcuno mentre altre partite
                        // dello stesso turno (votate da altri giocatori attivi) sono ancora da giocare.
                        // Se applicando le eliminazioni TUTTI i giocatori ancora attivi risulterebbero
                        // eliminati nello stesso turno, nessuno viene eliminato: il turno azzera il gruppo
                        // e la lega termina dichiarandoli ex aequo (gestito in calcolaStatoLega).
                        Map<Long, Enumeratori.EsitoGiocata> esitoPerGiocatore = new HashMap<>();
                        // Chi non ha fatto alcuna pick questo turno: per loro il KO resta eliminazione
                        // diretta anche in NBA, la vita è un cuscinetto solo per chi ha scelto e sbagliato.
                        Set<Long> pickMancante = new HashSet<>();
                        boolean turnoCompletoPerAttivi = true;
                        for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
                            Enumeratori.StatoGiocatore statoGiocatore = giocatoreDTO.getStatiPerLega().get(idLega);
                            if (statoGiocatore == Enumeratori.StatoGiocatore.ELIMINATO) {
                                continue;
                            }
                            final Integer gc = Integer.valueOf(nuovaGiornataCalcolata);
                            List<GiocataDTO> giocate = giocatoreDTO
                                    .getGiocate()
                                    .stream().sorted(Comparator.comparing(GiocataDTO::getGiornata))
                                    .filter(g -> g.getLegaId().equals(idLega) && g.getGiornata() + giornataIniziale - 1 == gc)
                                    .toList();
                            Enumeratori.EsitoGiocata esito = null;
                            if (giocate.size() == 0) {
                                // Nessuna pick: KO diretto, non dipende da altre partite del turno
                                esito = Enumeratori.EsitoGiocata.KO;
                                pickMancante.add(giocatoreDTO.getId());
                                GiocataRequestDTO giocataRequestDTO = new GiocataRequestDTO();
                                giocataRequestDTO.setGiocatoreId(giocatoreDTO.getId());
                                giocataRequestDTO.setGiornata(nuovaGiornataCalcolata - legaDTO.getGiornataIniziale() + 1);
                                giocataRequestDTO.setLegaId(idLega);
                                giocataRequestDTO.setEsitoGiocata(Enumeratori.EsitoGiocata.KO);
                                inserisciGiocataServiceProvider.getIfAvailable().inserisciGiocataDiSistema(giocataRequestDTO);
                            } else if (giocate.size() == 1) {
                                GiocataDTO giocataDTO = giocate.get(0);
                                if (giocataDTO.getEsito() == null) {
                                    Enumeratori.EsitoGiocata esitoCalcolato = settimanaMultiPartita
                                            ? calcolaEsitoSurvivorSettimana(giocataDTO.getSquadraSigla(), partite)
                                            : calcolaEsitoSurvivor(giocataDTO.getSquadraSigla(), partite);
                                    log.info("calcola lega={} giocatore={} sigla='{}' esitoCalcolato={}",
                                            idLega, giocatoreDTO.getId(), giocataDTO.getSquadraSigla(), esitoCalcolato);
                                    if (esitoCalcolato != null) {
                                        giocataDTO.setEsito(esitoCalcolato);
                                    }
                                }
                                esito = giocataDTO.getEsito();
                            }
                            if (esito == null) {
                                // Partita di questo giocatore non ancora terminata: il turno non è completo
                                turnoCompletoPerAttivi = false;
                            } else {
                                esitoPerGiocatore.put(giocatoreDTO.getId(), esito);
                            }
                        }

                        if (turnoCompletoPerAttivi && !esitoPerGiocatore.isEmpty()) {
                            // Determina, senza ancora mutare nulla, chi verrebbe eliminato applicando le regole normali
                            Map<Long, Boolean> saraEliminato = new HashMap<>();
                            for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
                                Enumeratori.EsitoGiocata esito = esitoPerGiocatore.get(giocatoreDTO.getId());
                                if (esito == null) {
                                    continue;
                                }
                                boolean pickReale = !pickMancante.contains(giocatoreDTO.getId());
                                boolean eliminato;
                                if (esito == Enumeratori.EsitoGiocata.OK) {
                                    eliminato = false;
                                } else if (consumaVita(esito, settimanaMultiPartita, pickReale)) {
                                    short viteAttuali = Optional.ofNullable(
                                            giocatoreDTO.getVitePerLega().get(idLega)).orElse((short) 0);
                                    eliminato = (viteAttuali - 1) <= 0;
                                } else {
                                    eliminato = true;
                                }
                                saraEliminato.put(giocatoreDTO.getId(), eliminato);
                            }
                            boolean tuttiEliminati = saraEliminato.values().stream().allMatch(Boolean::booleanValue);

                            if (tuttiEliminati) {
                                log.info("calcola lega={}: il turno {} eliminerebbe tutti i {} giocatori ancora attivi, nessuna eliminazione applicata (ex aequo)",
                                        idLega, nuovaGiornataCalcolata, saraEliminato.size());
                                legaDTO.setTuttiEliminatiStessoTurno(true);
                            } else {
                                for (GiocatoreDTO giocatoreDTO : legaDTO.getGiocatori()) {
                                    Enumeratori.EsitoGiocata esito = esitoPerGiocatore.get(giocatoreDTO.getId());
                                    if (esito == null) {
                                        continue;
                                    }
                                    boolean pickReale = !pickMancante.contains(giocatoreDTO.getId());
                                    if (esito == Enumeratori.EsitoGiocata.OK) {
                                        // nessuna azione
                                    } else if (consumaVita(esito, settimanaMultiPartita, pickReale)) {
                                        Short viteAttuali = Optional.ofNullable(
                                                giocatoreDTO.getVitePerLega().get(idLega)).orElse((short) 0);
                                        short nuoveVite = (short) (viteAttuali - 1);
                                        if (nuoveVite <= 0) {
                                            giocatoreDTO.getStatiPerLega().put(idLega, Enumeratori.StatoGiocatore.ELIMINATO);
                                        } else {
                                            giocatoreDTO.getVitePerLega().put(idLega, nuoveVite);
                                            Giocatore giocatoreEntity = giocatoreRepository.findById(giocatoreDTO.getId())
                                                    .orElse(null);
                                            Lega legaEntity = legaRepository.findById(idLega).orElse(null);
                                            if (giocatoreEntity != null && legaEntity != null) {
                                                vitaPersaRepository.save(new VitaPersa(giocatoreEntity, legaEntity, nuovaGiornataCalcolata));
                                            }
                                        }
                                    } else {
                                        // KO senza cuscinetto vite (non NBA, o nessuna pick effettuata)
                                        giocatoreDTO.getStatiPerLega().put(idLega, Enumeratori.StatoGiocatore.ELIMINATO);
                                    }
                                }
                            }
                        }
                    }
                    // Avanza anche quando tutte le giocate dei giocatori hanno già un esito,
                    // indipendentemente dallo stato globale del round (es. tennis con partite Cancelled).
                    final int gcFinal = nuovaGiornataCalcolata;
                    List<GiocataDTO> tutteLeGiocateDelRound = legaDTO.getGiocatori().stream()
                            .flatMap(g -> g.getGiocate().stream()
                                    .filter(gg -> gg.getLegaId().equals(idLega) && gg.getGiornata() + giornataIniziale - 1 == gcFinal))
                            .collect(Collectors.toList());
                    boolean tuttiGiocatoriRisolti = !tutteLeGiocateDelRound.isEmpty()
                            && tutteLeGiocateDelRound.stream().allMatch(gg -> gg.getEsito() != null);
                    if (statoGiornata == Enumeratori.StatoPartita.TERMINATA || tuttiGiocatoriRisolti) {
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
        List<PartitaDTO> matching = partite.stream()
                .filter(pm -> pm.getCasaSigla().equalsIgnoreCase(squadraSigla) || pm.getFuoriSigla().equalsIgnoreCase(squadraSigla))
                .sorted(Comparator.comparing(PartitaDTO::getOrario))
                .toList();
        if (matching.isEmpty()) return 0;
        // Preferisce il record TERMINATA se disponibile (evita record obsoleti DA_GIOCARE)
        Optional<PartitaDTO> optTerminata = matching.stream()
                .filter(pm -> pm.getStato() == Enumeratori.StatoPartita.TERMINATA)
                .findFirst();
        if (optTerminata.isEmpty()) return null;
        PartitaDTO p = optTerminata.get();
        if (Boolean.TRUE.equals(p.getForzata())) return 3;
        Integer sc = p.getScoreCasa();
        Integer sf = p.getScoreFuori();
        if (sc == null || sf == null) {
            // Partita terminata ma senza risultato (dato non ancora arrivato o partita annullata):
            // non assegno 0 punti in via definitiva, attendo il risultato. Il leader può forzare la partita.
            log.warn("calcolaPuntiCampionato: partita di '{}' TERMINATA senza punteggio, punti non assegnati (in attesa)", squadraSigla);
            return null;
        }
        if (p.getCasaSigla().equalsIgnoreCase(squadraSigla)) {
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
        List<PartitaDTO> matching = partite
                .stream()
                .filter(p -> p.getCasaSigla().equalsIgnoreCase(squadraSigla) || p.getFuoriSigla().equalsIgnoreCase(squadraSigla))
                .sorted(Comparator.comparing(PartitaDTO::getOrario))
                .toList();
        if (matching.isEmpty()) return Enumeratori.EsitoGiocata.KO;
        if (matching.size() > 1) {
            log.warn("calcolaEsitoSurvivor: trovati {} record per '{}', preferisco TERMINATA. Pulire record obsoleti in DB.",
                    matching.size(), squadraSigla);
        }
        // Preferisce il record TERMINATA: evita che record DA_GIOCARE obsoleti (opponent cambiato)
        // coprano il match già concluso con sigla fuoriSigla/casaSigla invariata.
        Optional<PartitaDTO> optTerminata = matching.stream()
                .filter(p -> p.getStato() == Enumeratori.StatoPartita.TERMINATA)
                .findFirst();
        if (optTerminata.isEmpty()) return null; // nessun match concluso ancora
        PartitaDTO partitaDTO = optTerminata.get();
        if (Boolean.TRUE.equals(partitaDTO.getForzata())) return Enumeratori.EsitoGiocata.OK;
        Integer scoreCasa = partitaDTO.getScoreCasa();
        Integer scoreFuori = partitaDTO.getScoreFuori();
        if (scoreCasa == null || scoreFuori == null) return Enumeratori.EsitoGiocata.KO;
        if (scoreCasa.equals(scoreFuori)) {
            // Fase knockout (es. Mondiali): controlla se il vincitore è stato determinato
            // da supplementari o rigori (vincitoreSigla impostato dall'API)
            if (partitaDTO.getVincitoreSigla() != null) {
                return partitaDTO.getVincitoreSigla().equalsIgnoreCase(squadraSigla)
                        ? Enumeratori.EsitoGiocata.OK
                        : Enumeratori.EsitoGiocata.KO;
            }
            return Enumeratori.EsitoGiocata.PAREGGIO;
        }
        boolean isVincente = partitaDTO.getCasaSigla().equalsIgnoreCase(squadraSigla)
                ? scoreCasa > scoreFuori
                : scoreFuori > scoreCasa;
        return isVincente ? Enumeratori.EsitoGiocata.OK : Enumeratori.EsitoGiocata.KO;
    }

    /**
     * NBA: ogni squadra gioca piu' partite nella settimana, quindi l'esito non dipende dalla prima
     * partita ma da tutte.
     */
    private boolean isSettimanaMultiPartita(CampionatoDTO campionatoDTO) {
        return campionatoDTO != null
                && Enumeratori.CampionatiDisponibili.NBA_RS.name().equals(campionatoDTO.getId());
    }

    /**
     * Vero se questo esito, in Survivor, va gestito col sistema vite (consuma una vita se disponibile,
     * elimina solo a vite esaurite) invece che con eliminazione diretta o sopravvivenza gratuita.
     * Regola generale: solo il pareggio. Eccezione NBA: dato che il pareggio esatto sommando più
     * partite nella settimana è quasi impossibile, anche perdere la settimana con una scelta
     * effettivamente giocata (non per assenza di pick) consuma una vita invece di eliminare subito —
     * altrimenti per l'NBA le vite non si userebbero quasi mai.
     */
    private boolean consumaVita(Enumeratori.EsitoGiocata esito, boolean settimanaMultiPartita, boolean pickReale) {
        if (esito == Enumeratori.EsitoGiocata.PAREGGIO) {
            return true;
        }
        return esito == Enumeratori.EsitoGiocata.KO && settimanaMultiPartita && pickReale;
    }

    private List<PartitaDTO> partiteDellaSquadra(String squadraSigla, List<PartitaDTO> partite) {
        return partite.stream()
                .filter(p -> p.getCasaSigla().equalsIgnoreCase(squadraSigla) || p.getFuoriSigla().equalsIgnoreCase(squadraSigla))
                .toList();
    }

    /**
     * Differenza punti della squadra in una partita terminata (positiva se ha vinto). Va chiamata solo dopo
     * aver verificato che la partita abbia un punteggio (vedi partitaSenzaRisultato): qui il caso senza
     * punteggio resta gestito in modo defensive-only, per non propagare mai un NPE.
     */
    private int differenzaPunti(PartitaDTO p, String squadraSigla) {
        Integer sc = p.getScoreCasa();
        Integer sf = p.getScoreFuori();
        if (sc == null || sf == null) return -1;
        return p.getCasaSigla().equalsIgnoreCase(squadraSigla) ? sc - sf : sf - sc;
    }

    /**
     * Vero se la partita è TERMINATA ma priva di punteggio (dato non ancora arrivato o partita annullata)
     * e non è stata forzata: in questo caso l'esito/punti non vanno assegnati, si deve attendere.
     */
    private boolean partitaSenzaRisultato(PartitaDTO p) {
        return !Boolean.TRUE.equals(p.getForzata()) && (p.getScoreCasa() == null || p.getScoreFuori() == null);
    }

    /**
     * Esito settimanale NBA: vince chi ha piu' vittorie che sconfitte nelle partite della squadra. A parita'
     * decide la differenza punti complessiva, PAREGGIO solo se e' esattamente zero. Restituisce null finche'
     * non sono terminate tutte le partite della squadra nella settimana, o se una di queste è terminata
     * senza punteggio (altrimenti verrebbe contata come sconfitta anche se il dato non è ancora arrivato).
     */
    private Enumeratori.EsitoGiocata calcolaEsitoSurvivorSettimana(String squadraSigla, List<PartitaDTO> partite) {
        if (squadraSigla == null) return Enumeratori.EsitoGiocata.KO;
        List<PartitaDTO> matching = partiteDellaSquadra(squadraSigla, partite);
        if (matching.isEmpty()) return Enumeratori.EsitoGiocata.KO;
        if (matching.stream().anyMatch(p -> p.getStato() != Enumeratori.StatoPartita.TERMINATA)) return null;
        if (matching.stream().anyMatch(this::partitaSenzaRisultato)) {
            log.warn("calcolaEsitoSurvivorSettimana: una partita di '{}' è TERMINATA senza punteggio, esito settimanale non ancora assegnato (in attesa)", squadraSigla);
            return null;
        }
        int vittorie = 0;
        int sconfitte = 0;
        int differenza = 0;
        for (PartitaDTO p : matching) {
            if (Boolean.TRUE.equals(p.getForzata())) {
                vittorie++;
                continue;
            }
            int diff = differenzaPunti(p, squadraSigla);
            differenza += diff;
            if (diff > 0) {
                vittorie++;
            } else {
                sconfitte++;
            }
        }
        if (vittorie != sconfitte) {
            return vittorie > sconfitte ? Enumeratori.EsitoGiocata.OK : Enumeratori.EsitoGiocata.KO;
        }
        if (differenza != 0) {
            return differenza > 0 ? Enumeratori.EsitoGiocata.OK : Enumeratori.EsitoGiocata.KO;
        }
        return Enumeratori.EsitoGiocata.PAREGGIO;
    }

    /**
     * Punti Campionato NBA: somma su tutte le partite della squadra nella settimana (3 vittoria, 1 pareggio,
     * 0 sconfitta). Restituisce null finche' non sono terminate tutte, o se una di queste è terminata senza
     * punteggio (in attesa, come per il calcolo a partita singola).
     */
    private Integer calcolaPuntiCampionatoSettimana(String squadraSigla, List<PartitaDTO> partite) {
        if (squadraSigla == null) return 0;
        List<PartitaDTO> matching = partiteDellaSquadra(squadraSigla, partite);
        if (matching.isEmpty()) return 0;
        if (matching.stream().anyMatch(p -> p.getStato() != Enumeratori.StatoPartita.TERMINATA)) return null;
        if (matching.stream().anyMatch(this::partitaSenzaRisultato)) {
            log.warn("calcolaPuntiCampionatoSettimana: una partita di '{}' è TERMINATA senza punteggio, punti settimanali non assegnati (in attesa)", squadraSigla);
            return null;
        }
        int punti = 0;
        for (PartitaDTO p : matching) {
            if (Boolean.TRUE.equals(p.getForzata())) {
                punti += 3;
                continue;
            }
            int diff = differenzaPunti(p, squadraSigla);
            punti += diff > 0 ? 3 : diff == 0 ? 1 : 0;
        }
        return punti;
    }

    /**
     * Esito NBA per la sola modalità Campionato: coerente con i punti mostrati nel recap/calendario,
     * a differenza del criterio usato in Survivor (bilancio vittorie/sconfitte) che può disaccordarsi
     * dai punti su settimane miste. Confronta i punti ottenuti con il massimo possibile (3 per ogni
     * partita giocata quella settimana): sopra metà = OK, sotto metà = KO, esattamente metà = PAREGGIO.
     */
    private Enumeratori.EsitoGiocata calcolaEsitoCampionatoSettimana(int puntiRound, String squadraSigla, List<PartitaDTO> partite) {
        int numPartite = partiteDellaSquadra(squadraSigla, partite).size();
        if (numPartite == 0) {
            return Enumeratori.EsitoGiocata.KO;
        }
        int massimoPossibile = 3 * numPartite;
        if (puntiRound * 2 > massimoPossibile) return Enumeratori.EsitoGiocata.OK;
        if (puntiRound * 2 < massimoPossibile) return Enumeratori.EsitoGiocata.KO;
        return Enumeratori.EsitoGiocata.PAREGGIO;
    }

    private Boolean vincente(String squadraSigla, List<PartitaDTO> partite) {
        Boolean ret = null;
        Optional<PartitaDTO> optPartitaDTO = partite
                .stream()
                .filter(p -> p.getCasaSigla().equalsIgnoreCase(squadraSigla) || p.getFuoriSigla().equalsIgnoreCase(squadraSigla))
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
                    if (casa.equalsIgnoreCase(squadraSigla)) {
                        if (scoreCasa > scoreFuori) {
                            ret = true;
                        } else {
                            ret = false;
                        }
                    }
                    if (fuori.equalsIgnoreCase(squadraSigla)) {
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
        // Rispetta il numero massimo di turni scelto dal creatore della lega (anche in Survivor)
        if (legaDTO.getGiornataFinale() != null && legaDTO.getGiornataFinale() < giornataCorrente) {
            giornataCorrente = legaDTO.getGiornataFinale();
        }
        //legaDTO.setGiornataDaGiocare(campionatoService.getCampionato(legaDTO.getCampionato().getId()).getGiornataDaGiocare());
        legaDTO.setGiornataDaGiocare(giornataCorrente);
        // La lista è ora indicizzata per giornata (indice = giornata-1, null se i dati non sono
        // ancora disponibili per quella giornata) — vedi CacheableService.processCampionatoTransactional.
        // Se è null, il frontend ricade su loadFirstMatchTimeAndStartCountdown (fetch live delle
        // partite) invece di mostrare erroneamente "tempo scaduto".
        if (giornataCorrente > 0 && legaDTO.getCampionato().getIniziGiornate() != null
                && legaDTO.getCampionato().getIniziGiornate().size() >= giornataCorrente) {
            LocalDateTime inizio = legaDTO.getCampionato().getIniziGiornate().get(giornataCorrente - 1);
            if (inizio != null) {
                legaDTO.setInizioProssimaGiornata(inizio);
            }
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
                && (legaDTO.getCampionato().getNumGiornate() == legaDTO.getGiornataCorrente()
                    || (legaDTO.getGiornataFinale() != null && legaDTO.getGiornataCorrente() >= legaDTO.getGiornataFinale()))
        ) {
            // Limite turni raggiunto: chi resta attivo è considerato ex aequo (assegnaPosizioniFinali)
            legaDTO.setStato(Enumeratori.StatoLega.TERMINATA);
            legaDTO.setGiornataFinale(legaDTO.getGiornataCorrente());
        } else if (!isCampionato
                && (legaDTO.getStato() == Enumeratori.StatoLega.AVVIATA || legaDTO.getStato() == Enumeratori.StatoLega.ERRORE)
                && (legaDTO.getGiocatori().stream()
                        .filter(g -> g.getStatiPerLega().get(legaDTO.getId()) == Enumeratori.StatoGiocatore.ATTIVO)
                        .count() <= 1
                    || legaDTO.isTuttiEliminatiStessoTurno())
        ) {
            // Resta un solo giocatore attivo, oppure il turno ha eliminato tutti i rimasti nello stesso turno
            // (in tal caso nessuno è stato marcato ELIMINATO: restano ATTIVO e vengono premiati ex aequo)
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

        // Classifica standard con pari merito (ex aequo): a parità di "chiave" si assegna la stessa
        // posizione, e la posizione successiva salta in avanti del numero di pari merito (1,1,3,...).
        // In Campionato la chiave è il punteggio; in Survivor tutti i giocatori ancora ATTIVO a fine
        // lega sono ex aequo (un solo attivo nel caso normale, più di uno se l'intero gruppo residuo
        // viene eliminato nello stesso turno), mentre i giocatori eliminati mantengono l'ordinamento
        // sequenziale già in uso.
        int assegnati = 0;
        int posizione = 1;
        Object chiavePrecedente = null;
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
                    Object chiave;
                    if (legaDTO.getModalita() == Enumeratori.ModalitaLega.CAMPIONATO) {
                        chiave = Optional.ofNullable(giocatoreDTO.getPuntiTotali()).orElse(0);
                    } else {
                        chiave = stato == Enumeratori.StatoGiocatore.ATTIVO ? "ATTIVO" : giocatoreDTO.getId();
                    }
                    assegnati++;
                    if (chiavePrecedente == null || !chiave.equals(chiavePrecedente)) {
                        posizione = assegnati;
                    }
                    giocatoreLega.setPosizioneFinale(posizione);
                    log.debug("Giocatore {} - Posizione: {}, Stato: {}, Giocate: {}",
                            giocatoreDTO.getNickname(), posizione, stato,
                            haGiocate ? giocatoreDTO.getGiocate().size() : 0);
                    chiavePrecedente = chiave;
                }
            }
        }

        log.info("Assegnate {} posizioni finali per lega {}", assegnati, legaDTO.getId());
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
        boolean isCampionato = legaDTO.getModalita() == Enumeratori.ModalitaLega.CAMPIONATO;
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
                    annullaEsitoGiocata(giocataDTO, isCampionato);
                }//ANNULLO LA PRECEDENTE SE E' L'ULTIMA
                if (legaDTO.getGiornataCalcolata() != null && legaDTO.getGiornataCalcolata() != currGG - 1) {
                    int prev = currGG - 1;
                    if (giocataDTO.getGiornata().equals(prev) && legaDTO.getStatiGiornate().get(prev + legaDTO.getGiornataIniziale() - 1) != Enumeratori.StatoPartita.SOSPESA) {
                        annullaEsitoGiocata(giocataDTO, isCampionato);
                    }
                }//ANNULLO LA PRIMA
                if (legaDTO.getGiornataCalcolata() == null && legaDTO.getGiornataIniziale() == giornataCorrente - 1) {
                    int prev = currGG - 1;
                    if (giocataDTO.getGiornata().equals(prev) && legaDTO.getStatiGiornate().get(prev + legaDTO.getGiornataIniziale() - 1) != Enumeratori.StatoPartita.SOSPESA) {
                        annullaEsitoGiocata(giocataDTO, isCampionato);
                    }
                }
            }
            if (isCampionato) {
                giocatoreDTO.setPuntiTotali(sommaPuntiGiocate(giocatoreDTO));
            } else {
                // In Campionato nessuno viene mai eliminato (KO = 0 punti): ricalcolare lo stato userebbe
                // la logica Survivor e marcherebbe ELIMINATO chi ha semplicemente perso una partita.
                Enumeratori.StatoGiocatore statoGiocatore = ricalcolaStatoGiocatore(giocatoreDTO, legaDTO);
                giocatoreDTO.getStatiPerLega().put(legaDTO.getId(), statoGiocatore);
            }

        }

        salva(legaDTO, null);
        return getLegaDTO(legaDTO.getId(), true, userId);

    }

    /**
     * Annulla l'esito di una giocata. In Campionato azzera anche i punti della giocata: il totale del
     * giocatore va poi ricalcolato con sommaPuntiGiocate.
     */
    private void annullaEsitoGiocata(GiocataDTO giocataDTO, boolean isCampionato) {
        if (isCampionato) {
            giocataDTO.setPunti(null);
        }
        giocataDTO.setEsito(null);
    }

    /**
     * Punti totali Campionato: somma dei punti delle giocate con esito. Le giocate del DTO sono
     * gia' filtrate sulla lega corrente (LegaMapper).
     */
    private int sommaPuntiGiocate(GiocatoreDTO giocatoreDTO) {
        return giocatoreDTO.getGiocate().stream()
                .filter(g -> g.getEsito() != null)
                .mapToInt(g -> Optional.ofNullable(g.getPunti()).orElse(0))
                .sum();
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

    /**
     * Trasferisce il ruolo di leader dal leader attuale a un altro giocatore della lega (swap
     * uno-a-uno: il leader attuale diventa GIOCATORE, il destinatario diventa LEADER). In ogni
     * momento esiste esattamente un leader per lega, mai zero né più di uno — tutto il resto del
     * codice (calcola, termina, rinomina, ecc.) assume questa invariante.
     */
    @Transactional
    public LegaDTO trasferisciLeader(Long idLega, Long idGiocatoreDestinazione) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        Lega lega = legaRepository.findById(idLega)
                .orElseThrow(() -> new RuntimeException("Lega non trovata: " + idLega));

        GiocatoreLega leaderAttuale = lega.getGiocatoreLeghe().stream()
                .filter(g -> g.getRuolo() == Enumeratori.RuoloGiocatoreLega.LEADER)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Nessun leader trovato per la lega " + idLega));

        if (leaderAttuale.getGiocatore().getId().equals(idGiocatoreDestinazione)) {
            throw new ManagedException("Sei già il leader di questa lega", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA);
        }

        GiocatoreLega nuovoLeader = lega.getGiocatoreLeghe().stream()
                .filter(g -> g.getGiocatore().getId().equals(idGiocatoreDestinazione))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Giocatore non trovato nella lega"));

        leaderAttuale.setRuolo(Enumeratori.RuoloGiocatoreLega.GIOCATORE);
        nuovoLeader.setRuolo(Enumeratori.RuoloGiocatoreLega.LEADER);
        legaRepository.save(lega);

        notificaNuovoLeader(leaderAttuale.getGiocatore(), nuovoLeader.getGiocatore(), lega);

        return getLegaDTO(idLega, true, userId);
    }

    /** Avvisa il nuovo leader via push — un fallimento qui non deve mai bloccare il trasferimento già salvato. */
    private void notificaNuovoLeader(Giocatore vecchioLeader, Giocatore nuovoLeader, Lega lega) {
        try {
            if (nuovoLeader.getUser() == null) return;
            String lingua = nuovoLeader.getUser().getLingua();
            var dto = new it.ddlsolution.survivor.dto.PushNotificationDTO();
            dto.setTitle(notificationI18nService.testo("notif.leaderTransfer.title", lingua));
            dto.setBody(notificationI18nService.testo("notif.leaderTransfer.body", lingua, vecchioLeader.getNickname(), lega.getName()));
            dto.setTipoNotifica(Enumeratori.TipoNotifica.LEADER_TRANSFER);
            dto.setExpiringAt(LocalDateTime.now().plusDays(7));
            dto.setLegaId(lega.getId());
            pushNotificationService.sendNotificationToUsers(List.of(nuovoLeader.getUser().getId()), dto);
        } catch (Exception e) {
            log.warn("Errore notifica nuovo leader lega {}: {}", lega.getId(), e.getMessage());
        }
    }

    @LoggaDispositiva(tipologia = "nuovaEdizione")
    @Transactional
    public LegaDTO nuovaEdizione(Long idLega) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        // Solo il leader dell'edizione precedente può crearne una nuova: altrimenti ogni
        // partecipante che clicca il bottone genera una propria edizione 2 duplicata,
        // diventandone leader (vedi giocatoreLega.setRuolo(...LEADER...) più sotto).
        Optional<GiocatoreLega> giocatoreLegaLeader = giocatoreLegaService.findByLega_IdAndGiocatore_User_Id(idLega, userId);
        if (giocatoreLegaLeader.isEmpty() || giocatoreLegaLeader.get().getRuolo() != Enumeratori.RuoloGiocatoreLega.LEADER) {
            throw new ManagedException("Solo il leader della lega può creare una nuova edizione", ManagedException.InternalCode.NOT_LEADER);
        }

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

    /**
     * Rinomina una lega. Il nome è condiviso da tutte le edizioni della stessa lega
     * (create tramite {@link #nuovaEdizione}), quindi la rinomina viene propagata
     * a tutte le edizioni con il nome corrente, per non spezzare il raggruppamento in home.
     */
    @Transactional
    @LoggaDispositiva(tipologia = "rinominaLega")
    public LegaDTO rinominaLega(Long idLega, String nuovoNome) {
        if (nuovoNome == null || nuovoNome.trim().isEmpty()) {
            throw new ManagedException("Il nome della lega non può essere vuoto", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA);
        }
        String nomePulito = nuovoNome.trim();
        if (nomePulito.length() > 100) {
            throw new ManagedException("Il nome della lega non può superare i 100 caratteri", ManagedException.InternalCode.OPERAZIONE_NON_CONSENTITA);
        }

        Lega lega = legaRepository.findById(idLega)
                .orElseThrow(() -> new ManagedException("Lega non trovata", ManagedException.InternalCode.LEGA_NOT_FOUND));

        String vecchioNome = lega.getName();
        if (!vecchioNome.equals(nomePulito)) {
            if (!legaRepository.findAllByName(nomePulito).isEmpty()) {
                throw new ManagedException("Nome lega già presente", ManagedException.InternalCode.CODE_LEGA_PRESENTE);
            }
            List<Lega> tutteEdizioni = legaRepository.findAllByName(vecchioNome);
            tutteEdizioni.forEach(l -> l.setName(nomePulito));
            legaRepository.saveAll(tutteEdizioni);
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        return getLegaDTO(idLega, true, userId);
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
