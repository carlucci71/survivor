package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaJoinRequestDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.GiocatoreLega;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.LegaJoinRequest;
import it.ddlsolution.survivor.exception.ManagedException;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import it.ddlsolution.survivor.repository.LegaJoinRequestRepository;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LegaJoinRequestService {

    private final LegaJoinRequestRepository joinRequestRepository;
    private final LegaRepository legaRepository;
    private final GiocatoreRepository giocatoreRepository;
    private final GiocatoreLegaService giocatoreLegaService;
    private final PushNotificationService pushNotificationService;

    // ─── UTENTE: richiede di entrare ────────────────────────────────────────

    @Transactional
    public LegaJoinRequestDTO richiediIngresso(Long idLega) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) auth.getPrincipal();

        Lega lega = legaRepository.findById(idLega)
                .orElseThrow(() -> new ManagedException("Lega non trovata", ManagedException.InternalCode.LEGA_NOT_FOUND));

        if (!lega.isPubblica()) {
            throw new ManagedException("Lega non pubblica", ManagedException.InternalCode.LEGA_NOT_PUBBLICA);
        }
        if (lega.getStato() != Enumeratori.StatoLega.DA_AVVIARE) {
            throw new ManagedException("La lega non accetta più iscrizioni", ManagedException.InternalCode.LEGA_NOT_FOUND);
        }

        Giocatore giocatore = giocatoreRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Giocatore non trovato per userId: " + userId));

        // già iscritto?
        boolean alreadyJoined = lega.getGiocatoreLeghe().stream()
                .anyMatch(gl -> gl.getGiocatore().getId().equals(giocatore.getId()));
        if (alreadyJoined) {
            throw new ManagedException("Sei già iscritto a questa lega", ManagedException.InternalCode.ALREADY_JOINED);
        }

        // richiesta già esistente?
        if (joinRequestRepository.existsByLega_IdAndGiocatore_IdAndStato(idLega, giocatore.getId(), Enumeratori.StatoRichiesta.PENDING)) {
            throw new ManagedException("Hai già una richiesta in attesa", ManagedException.InternalCode.REQUEST_ALREADY_EXISTS);
        }

        // accesso libero → entra direttamente tramite LegaJoinService esistente
        if (lega.isAccessoLibero()) {
            // Controllo posti
            if (lega.getMaxPartecipanti() != null && lega.getGiocatoreLeghe().size() >= lega.getMaxPartecipanti()) {
                throw new ManagedException("Lega al completo", ManagedException.InternalCode.LEGA_FULL);
            }
            GiocatoreLega gl = new GiocatoreLega();
            gl.getId().setIdLega(idLega);
            gl.getId().setIdGiocatore(giocatore.getId());
            gl.setGiocatore(giocatore);
            gl.setLega(lega);
            gl.setStato(Enumeratori.StatoGiocatore.ATTIVO);
            gl.setRuolo(Enumeratori.RuoloGiocatoreLega.GIOCATORE);
            giocatoreLegaService.save(gl);

            // Crea una richiesta già approvata per tracciabilità
            LegaJoinRequest req = new LegaJoinRequest();
            req.setLega(lega);
            req.setGiocatore(giocatore);
            req.setStato(Enumeratori.StatoRichiesta.APPROVED);
            req.setResolvedAt(LocalDateTime.now());
            joinRequestRepository.save(req);

            return toDTO(req);
        }

        // accesso su approvazione → crea richiesta PENDING
        LegaJoinRequest req = new LegaJoinRequest();
        req.setLega(lega);
        req.setGiocatore(giocatore);
        req.setStato(Enumeratori.StatoRichiesta.PENDING);
        joinRequestRepository.save(req);

        // Notifica al leader
        notificaLeader(lega, giocatore);

        log.info("Richiesta ingresso lega {} da giocatore {}", idLega, giocatore.getId());
        return toDTO(req);
    }

    // ─── LEADER: lista richieste pendenti ───────────────────────────────────

    @Transactional(readOnly = true)
    public List<LegaJoinRequestDTO> richiestePendenti(Long idLega) {
        verificaLeader(idLega);
        return joinRequestRepository.findByLega_IdAndStato(idLega, Enumeratori.StatoRichiesta.PENDING)
                .stream().map(this::toDTO).toList();
    }

    // ─── LEADER: approva ────────────────────────────────────────────────────

    @Transactional
    public LegaJoinRequestDTO approva(Long idLega, Long requestId) {
        verificaLeader(idLega);

        LegaJoinRequest req = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new ManagedException("Richiesta non trovata", ManagedException.InternalCode.REQUEST_NOT_FOUND));

        Lega lega = req.getLega();

        if (lega.getMaxPartecipanti() != null && lega.getGiocatoreLeghe().size() >= lega.getMaxPartecipanti()) {
            throw new ManagedException("Lega al completo", ManagedException.InternalCode.LEGA_FULL);
        }

        req.setStato(Enumeratori.StatoRichiesta.APPROVED);
        req.setResolvedAt(LocalDateTime.now());
        joinRequestRepository.save(req);

        Giocatore giocatore = req.getGiocatore();
        GiocatoreLega gl = new GiocatoreLega();
        gl.getId().setIdLega(lega.getId());
        gl.getId().setIdGiocatore(giocatore.getId());
        gl.setGiocatore(giocatore);
        gl.setLega(lega);
        gl.setStato(Enumeratori.StatoGiocatore.ATTIVO);
        gl.setRuolo(Enumeratori.RuoloGiocatoreLega.GIOCATORE);
        giocatoreLegaService.save(gl);

        // Notifica all'utente
        notificaEsito(giocatore, lega, true);

        log.info("Richiesta {} approvata per lega {}", requestId, idLega);
        return toDTO(req);
    }

    // ─── LEADER: rifiuta ────────────────────────────────────────────────────

    @Transactional
    public LegaJoinRequestDTO rifiuta(Long idLega, Long requestId) {
        verificaLeader(idLega);

        LegaJoinRequest req = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new ManagedException("Richiesta non trovata", ManagedException.InternalCode.REQUEST_NOT_FOUND));

        req.setStato(Enumeratori.StatoRichiesta.REJECTED);
        req.setResolvedAt(LocalDateTime.now());
        joinRequestRepository.save(req);

        // Notifica all'utente
        notificaEsito(req.getGiocatore(), req.getLega(), false);

        log.info("Richiesta {} rifiutata per lega {}", requestId, idLega);
        return toDTO(req);
    }

    // ─── UTENTE: cancella la sua richiesta ─────────────────────────────────

    @Transactional
    public void annullaRichiesta(Long idLega) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) auth.getPrincipal();

        Giocatore giocatore = giocatoreRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Giocatore non trovato"));

        LegaJoinRequest req = joinRequestRepository.findByLega_IdAndGiocatore_Id(idLega, giocatore.getId())
                .orElseThrow(() -> new ManagedException("Richiesta non trovata", ManagedException.InternalCode.REQUEST_NOT_FOUND));

        joinRequestRepository.delete(req);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private void verificaLeader(Long idLega) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) auth.getPrincipal();
        Giocatore giocatore = giocatoreRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Giocatore non trovato"));

        boolean isLeader = legaRepository.findById(idLega)
                .map(lega -> lega.getGiocatoreLeghe().stream()
                        .anyMatch(gl -> gl.getGiocatore().getId().equals(giocatore.getId())
                                && gl.getRuolo() == Enumeratori.RuoloGiocatoreLega.LEADER))
                .orElse(false);

        if (!isLeader) {
            throw new ManagedException("Solo il leader può gestire le richieste", ManagedException.InternalCode.NOT_LEADER);
        }
    }

    private void notificaLeader(Lega lega, Giocatore richiedente) {
        try {
            lega.getGiocatoreLeghe().stream()
                    .filter(gl -> gl.getRuolo() == Enumeratori.RuoloGiocatoreLega.LEADER)
                    .map(gl -> gl.getGiocatore().getUser().getId())
                    .toList()
                    .forEach(leaderId -> {
                        var dto = new it.ddlsolution.survivor.dto.PushNotificationDTO();
                        dto.setTitle("Nuova richiesta di ingresso");
                        dto.setBody(richiedente.getNickname() + " vuole entrare nella lega \"" + lega.getName() + "\"");
                        dto.setTipoNotifica(Enumeratori.TipoNotifica.JOIN_REQUEST_RICEVUTA);
                        dto.setExpiringAt(LocalDateTime.now().plusDays(2));
                        dto.setLegaId(lega.getId());
                        pushNotificationService.sendNotificationToUsers(List.of(leaderId), dto);
                    });
        } catch (Exception e) {
            log.warn("Errore notifica leader lega {}: {}", lega.getId(), e.getMessage());
        }
    }

    private void notificaEsito(Giocatore giocatore, Lega lega, boolean approvata) {
        try {
            var dto = new it.ddlsolution.survivor.dto.PushNotificationDTO();
            if (approvata) {
                dto.setTitle("Richiesta approvata! 🎉");
                dto.setBody("Sei stato accettato nella lega \"" + lega.getName() + "\"");
                dto.setTipoNotifica(Enumeratori.TipoNotifica.JOIN_REQUEST_APPROVATA);
            } else {
                dto.setTitle("Richiesta non accettata");
                dto.setBody("La tua richiesta per \"" + lega.getName() + "\" non è stata accettata");
                dto.setTipoNotifica(Enumeratori.TipoNotifica.JOIN_REQUEST_RIFIUTATA);
            }
            dto.setExpiringAt(LocalDateTime.now().plusDays(7));
            pushNotificationService.sendNotificationToUsers(List.of(giocatore.getUser().getId()), dto);
        } catch (Exception e) {
            log.warn("Errore notifica esito utente {}: {}", giocatore.getId(), e.getMessage());
        }
    }

    private LegaJoinRequestDTO toDTO(LegaJoinRequest req) {
        LegaJoinRequestDTO dto = new LegaJoinRequestDTO();
        dto.setId(req.getId());
        dto.setLegaId(req.getLega().getId());
        dto.setLegaName(req.getLega().getName());
        dto.setGiocatoreId(req.getGiocatore().getId());
        dto.setGiocatoreNickname(req.getGiocatore().getNickname());
        if (req.getGiocatore().getUser() != null) {
            dto.setGiocatoreEmail(req.getGiocatore().getUser().getEmail());
        }
        dto.setStato(req.getStato());
        dto.setCreatedAt(req.getCreatedAt());
        dto.setResolvedAt(req.getResolvedAt());
        return dto;
    }
}
