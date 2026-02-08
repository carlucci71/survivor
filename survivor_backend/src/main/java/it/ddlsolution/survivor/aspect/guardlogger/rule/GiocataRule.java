package it.ddlsolution.survivor.aspect.guardlogger.rule;


import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.UserDTO;
import it.ddlsolution.survivor.service.GiocatoreService;
import it.ddlsolution.survivor.service.PartitaMockService;
import it.ddlsolution.survivor.service.UserService;
import it.ddlsolution.survivor.util.Utility;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static it.ddlsolution.survivor.aspect.guardlogger.rule.GuardRule.PARAM.IDLEGA;
import static it.ddlsolution.survivor.aspect.guardlogger.rule.GuardRule.PARAM.SIGLASQUADRA;
import static it.ddlsolution.survivor.util.Constant.CALENDARIO_MOCK;
import static it.ddlsolution.survivor.util.Constant.WARNING_GIOCATA_RULE;

@Slf4j
@Component
@RequiredArgsConstructor
public class GiocataRule implements GuardRule {

    private final GiocatoreService giocatoreService;
    private final Utility utility;
    private final PartitaMockService partitaMockService;

    @Override
    public Map<String, Object> run(Map<GuardRule.PARAM, Object> args) {
        Map<String, Object> ret = new HashMap<>();
        List<String> warning = new ArrayList<>();
        LegaDTO legaDTO = (LegaDTO) args.get(IDLEGA);
        String squadra = (String) args.get(SIGLASQUADRA);
        Integer giornata = (Integer) args.get(PARAM.GIORNATA);
        GiocatoreDTO giocatoreDTO = (GiocatoreDTO) args.get(PARAM.IDGIOCATORE);
        Long idDelGiocatore = giocatoreDTO.getUser() == null ? -1 : giocatoreDTO.getUser().getId();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InsufficientAuthenticationException("Utente non autenticato");
        }
        Long userId = (Long) authentication.getPrincipal();
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + "ADMIN"));
        Long idLega = legaDTO.getId();
        Enumeratori.RuoloGiocatoreLega ruoloGiocatoreLega = legaDTO.getRuoloGiocatoreLega();
        Enumeratori.StatoPartita statoGiornataCorrente = legaDTO.getStatoGiornataCorrente();
        Optional<GiocataDTO> attGiocata = giocatoreDTO.getGiocate().stream()
                .filter(g -> g.getGiornata().equals(giornata) && g.getLegaId().equals(idLega))
                .findFirst();

        if (ruoloGiocatoreLega == Enumeratori.RuoloGiocatoreLega.NESSUNO) {
            throw new AccessDeniedException("Non partecipi alla lega " + legaDTO.getName() + "-" + legaDTO.getEdizione());
        }
        if (giocatoreDTO.getStatiPerLega().getOrDefault(idLega, Enumeratori.StatoGiocatore.ELIMINATO) != Enumeratori.StatoGiocatore.ATTIVO) {
            throw new AccessDeniedException("Il giocatore " + giocatoreDTO.getId() + " non è attivo ");
        }
        if (!userId.equals(idDelGiocatore)
                && !isAdmin
                && ruoloGiocatoreLega != Enumeratori.RuoloGiocatoreLega.LEADER
        ) {
            throw new AccessDeniedException("Solo il leader o admin può giocare per un altro utente");
        }
        if (!userId.equals(idDelGiocatore)
        ) {
            warning.add("Giocata di " + getUser(userId).getNickname() + "[" + (isAdmin ? "ADMIN" : "LEADER") + "] UserId:" + userId + " Stato: " + statoGiornataCorrente.getDescrizione());
        }
        if (legaDTO.getGiornataCorrente() != legaDTO.getGiornataIniziale() + giornata - 1) {
            throw new AccessDeniedException("Non è la giornata corrente");
        }
        if (attGiocata.isPresent() && attGiocata.get().getEsito() != null) {
            throw new AccessDeniedException("Giocata con esito!");
        }
        if (statoGiornataCorrente == Enumeratori.StatoPartita.SOSPESA) {
            throw new AccessDeniedException("La giornata è sospesa");
        }
        if (statoGiornataCorrente != Enumeratori.StatoPartita.DA_GIOCARE
                && !isAdmin
                && ruoloGiocatoreLega != Enumeratori.RuoloGiocatoreLega.LEADER
        ) {
            throw new AccessDeniedException("Solo il leader o admin può giocare su una giornata non ancora da giocare");
        }
        if (statoGiornataCorrente != Enumeratori.StatoPartita.DA_GIOCARE
        ) {
            LocalDateTime dataRiferimento = LocalDateTime.now();
            if (utility.getImplementationExternalApi().equals(CALENDARIO_MOCK)) {
                dataRiferimento = partitaMockService.getDataRiferimento();
            }
            warning.add("Giocata alle " + dataRiferimento);
        }
        if (giocatoreDTO.getGiocate().stream()
                .filter(g -> !g.getGiornata().equals(giornata) && g.getLegaId().equals(idLega) && squadra.equals(g.getSquadraSigla()))
                .count() > 0) {
            throw new AccessDeniedException("Squadra già usata");
        }
        if (legaDTO.getStato() == Enumeratori.StatoLega.TERMINATA) {
            throw new AccessDeniedException("Lega in stato TERMINATA");
        }
        if (legaDTO.getGiornataDaGiocare() > 0 && (legaDTO.getGiornataDaGiocare() < legaDTO.getGiornataCorrente())) {
            //throw new AccessDeniedException("La giornata da giocare " + legaDTO.getGiornataDaGiocare() + " è inferiore alla corrente " + legaDTO.getGiornataCorrente());
        }
        if (warning.size() > 0) {
            ret.put(WARNING_GIOCATA_RULE, warning);
        }
        return ret;
    }

    private GiocatoreDTO getUser(Long userId) {
        return giocatoreService.findByUserId(userId);
    }

}