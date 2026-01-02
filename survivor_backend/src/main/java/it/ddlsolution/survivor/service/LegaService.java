package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.aspect.LoggaDispositiva;
import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.LegaInsertDTO;
import it.ddlsolution.survivor.dto.LegaJoinDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.GiocatoreLega;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.exception.ManagedException;
import it.ddlsolution.survivor.mapper.LegaMapper;
import it.ddlsolution.survivor.repository.GiocatoreLegaRepository;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
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
    private final CampionatoService campionatoService;
    private final LegaMapper legaMapper;
    private final UtilCalendarioService utilCalendarioService;
    private final CacheableService cacheableService;
    private final GiocatoreService giocatoreService;
    private final UserService userService;
    private final EmailService emailService;
    private final MagicLinkService magicLinkService;

    @Transactional(readOnly = true)
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
        return legaMapper.toDTOList(legheDaAvviare);
    }

    @Transactional(readOnly = true)
    public List<LegaDTO> legheUser(Long userId) {
        List<Lega> leghe = legaRepository.findByGiocatoreLeghe_Giocatore_User_Id(userId);
        List<LegaDTO> legheDTO = new ArrayList<>();
        for (Lega lega : leghe) {
            legheDTO.add(getLegaDTO(lega.getId(), false));
        }
        return legheDTO;
    }

    @Transactional(readOnly = true)
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

            GiocatoreDTO giocatoreDTO = giocatoreService.getMyInfoInLega(legaDTO);
            legaDTO.setGiocatori(List.of(giocatoreDTO));

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


    @Transactional
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
                                                giocata.setEsito(giocataDTO.getEsito());
                                            });
                                }
                            }
                        });
            }
        }

        // Salva e ritorna
        return legaMapper.toDTO(legaRepository.save(lega));
    }

    @Transactional(readOnly = true)
    public List<LegaDTO> allLeghe() {
        return legaMapper.toDTOListProjection(legaRepository.allLeghe());
    }

    @Transactional(readOnly = true)
    public Enumeratori.StatoPartita statoGiornata(LegaDTO legaDTO, int giornata) {
        CampionatoDTO campionatoDTO = campionatoService.getCampionato(legaDTO.getCampionato().getId());
        List<PartitaDTO> partite = utilCalendarioService.partite(campionatoDTO, giornata);
        return statoGiornata(partite, giornata, legaDTO);
    }

    @Transactional(readOnly = true)
    public Enumeratori.StatoPartita statoGiornata(List<PartitaDTO> partite, int giornata, LegaDTO legaDTO) {
        List<Integer> listaSospensioni = cacheableService.allSospensioni().getOrDefault(legaDTO.getId(), new ArrayList<>());
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
    public LegaDTO calcola(Long idLega, int giornataDaCalcolare) {
        log.info("CALCOLA");

        LegaDTO legaDTO = getLegaDTO(idLega, true);
        CampionatoDTO campionatoDTO = campionatoService.getCampionato(legaDTO.getCampionato().getId());
        List<PartitaDTO> partite = utilCalendarioService.partite(campionatoDTO, giornataDaCalcolare);
        final int giornataIniziale = legaDTO.getGiornataIniziale();
        Enumeratori.StatoPartita statoGiornata = statoGiornata(partite, giornataDaCalcolare, legaDTO);
        if (statoGiornata != Enumeratori.StatoPartita.DA_GIOCARE) {
            if (statoGiornata == Enumeratori.StatoPartita.SOSPESA) {
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
                if (statoGiornata == Enumeratori.StatoPartita.TERMINATA) {
                    legaDTO.setGiornataCalcolata(giornataDaCalcolare);
                }
            }
        }
        salva(legaDTO);
        return getLegaDTO(legaDTO.getId(), true);
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
        } else {
            return false;
        }
        return ret;
    }

    private void addInfoCalcolate(LegaDTO legaDTO) {
        Integer giornataCalcolata = legaDTO.getGiornataCalcolata();
        Integer giornataCorrente = (giornataCalcolata == null ? legaDTO.getGiornataIniziale() : giornataCalcolata + 1);
        if (legaDTO.getCampionato().getNumGiornate() < giornataCorrente) {
            giornataCorrente = legaDTO.getCampionato().getNumGiornate();
        }

        legaDTO.setGiornataCorrente(giornataCorrente);
        Map<Integer, Enumeratori.StatoPartita> statiGiornate = new HashMap<>();
        for (Integer giornata = legaDTO.getGiornataIniziale(); giornata <= giornataCorrente; giornata++) {
            Enumeratori.StatoPartita statoPartita = statoGiornata(legaDTO, giornata);
            statiGiornate.put(giornata, statoPartita);
        }
        legaDTO.setStatoGiornataCorrente(statiGiornate.get(giornataCorrente));
        legaDTO.setStatiGiornate(statiGiornate);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        Enumeratori.RuoloGiocatoreLega myRoleInLega = legaDTO.getGiocatori().stream()
                .filter(g -> g.getUser() != null && g.getUser().getId().equals(userId))
                .map(g -> g.getRuoliPerLega())
                .findFirst()
                .map(r -> r.get(legaDTO.getId()))
                .orElseGet(() -> Enumeratori.RuoloGiocatoreLega.GIOCATORE);

        legaDTO.setRuoloGiocatoreLega(myRoleInLega);

    }


    @LoggaDispositiva(tipologia = "undoCalcola")
    @Transactional
    public LegaDTO undoCalcola(Long idLega) {
        LegaDTO legaDTO = getLegaDTO(idLega, true);
        int giornataCorrente = legaDTO.getGiornataCorrente();
        //if (legaDTO.getStatoGiornataCorrente() == Enumeratori.StatoPartita.TERMINATA)
        {
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
                if (giocataDTO.getGiornata().equals(currGG)) {
                    giocataDTO.setEsito(null);
                }
                if (legaDTO.getGiornataCalcolata() != null && legaDTO.getGiornataCalcolata() != currGG - 1) {
                    int prev = currGG - 1;
                    if (giocataDTO.getGiornata().equals(prev)) {
                        giocataDTO.setEsito(null);
                    }
                }
                if (legaDTO.getGiornataCalcolata() == null && legaDTO.getGiornataIniziale() == giornataCorrente - 1) {
                    int prev = currGG - 1;
                    if (giocataDTO.getGiornata().equals(prev)) {
                        giocataDTO.setEsito(null);
                    }
                }
            }

            if (legaDTO.getGiornataIniziale() == giornataCorrente-1){
                giocatoreDTO.getStatiPerLega().put(legaDTO.getId(), Enumeratori.StatoGiocatore.ATTIVO);
            } else {

                Optional<GiocataDTO> lastGiocata = giocatoreDTO.getGiocate().stream().filter(g -> g.getGiornata().equals(giornataCorrente-2)).findFirst();
                if (lastGiocata.isEmpty()) {
                    giocatoreDTO.getStatiPerLega().put(legaDTO.getId(), Enumeratori.StatoGiocatore.ELIMINATO);
                } else {
                    long contaKO = giocatoreDTO.getGiocate().stream()
                            .filter(g -> g.getGiornata() < giornataCorrente)
                            .filter(g -> g.getEsito() != null && g.getEsito() == Enumeratori.EsitoGiocata.KO)
                            .count();
                    if (contaKO == 0) {
                        giocatoreDTO.getStatiPerLega().put(legaDTO.getId(), Enumeratori.StatoGiocatore.ATTIVO);
                    } else {
                        giocatoreDTO.getStatiPerLega().put(legaDTO.getId(), Enumeratori.StatoGiocatore.ELIMINATO);
                    }
                }
            }
        }

        salva(legaDTO);
        return getLegaDTO(legaDTO.getId(), true);

    }

    @Transactional
    public LegaDTO inserisciLega(LegaInsertDTO legaInsertDTO) {
        if (legaRepository.findByNome(legaInsertDTO.getNome()).isPresent()) {
            throw new ManagedException("Nome lega già presente", ManagedException.InternalCode.CODE_LEGA_PRESENTE);
        }
        Lega lega = legaMapper.toEntity(legaInsertDTO);
        List<GiocatoreLega> giocatoriLega = new ArrayList<>();
        GiocatoreLega giocatoreLega = new GiocatoreLega();
        Giocatore giocatore = giocatoreService.findMe();
        giocatoreLega.setGiocatore(giocatore);
        giocatoreLega.setLega(lega);
        giocatoreLega.setRuolo(Enumeratori.RuoloGiocatoreLega.LEADER);
        giocatoreLega.setStato(Enumeratori.StatoGiocatore.ATTIVO);
        giocatoriLega.add(giocatoreLega);
        lega.setGiocatoreLeghe(giocatoriLega);
        Lega legaSalvata = legaRepository.save(lega);
        return legaMapper.toDTO(legaSalvata);
    }

    @Transactional
    public LegaDTO join(Long idLega, LegaJoinDTO legaInsertDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        String tokenOriginal = legaInsertDTO.getTokenOriginal();
        Lega lega = legaRepository.findById(idLega).orElseThrow(() -> new RuntimeException("Lega non trovata: " + idLega));
        if (!ObjectUtils.isEmpty(lega.getPwd())) {
            if (ObjectUtils.isEmpty(tokenOriginal) && !lega.getPwd().equals(legaInsertDTO.getPwd())) {
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
        giocatoriLega.add(giocatoreLega);
        lega.setGiocatoreLeghe(giocatoriLega);
        Lega legaSalvata = legaRepository.save(lega);
        return legaMapper.toDTO(legaSalvata);
    }


    @Transactional
    public void invita(long idLega, List<String> emails) {
        for (String email : emails) {
            LegaDTO legaDTO = getLegaDTO(idLega, false);
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
            String magicLink = magicLinkService.getUrlMagicLink(token, Enumeratori.TipoMagicToken.JOIN.getCodice());
            emailService.send(email, subject, buildEmailContent(magicLink, expirationDays, legaDTO));
            log.info("Magic link inviato a: {}", email);
        }
    }

    private String buildEmailContent(String magicLink, int expirationDays, LegaDTO legaDTO) {
        return """
                Ciao,
                
                Sei stato invitato alla lega %s xxxx...... :
                Clicca sul link seguente per accedere a Survivor:
                %s
                
                Questo link è valido per %d giorni.
                
                Se non sei interessato, ignora questa email.
                
                Saluti,
                Il team di Survivor
                """.formatted(legaDTO.getNome(), magicLink, expirationDays);
    }

}
