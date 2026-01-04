package it.ddlsolution.survivor.aspect.guardlogger.rule;


import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Map;
import java.util.Optional;

import static it.ddlsolution.survivor.aspect.guardlogger.rule.GuardRule.PARAM.IDLEGA;
import static it.ddlsolution.survivor.aspect.guardlogger.rule.GuardRule.PARAM.SIGLASQUADRA;

@Slf4j
public class GiocataRule implements GuardRule {
    @Override
    public void run(Map<GuardRule.PARAM, Object> args) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InsufficientAuthenticationException("Utente non autenticato");
        }
        Long userId = (Long) authentication.getPrincipal();
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + "ADMIN"));
        LegaDTO legaDTO = (LegaDTO) args.get(IDLEGA);
        Long legaDTOId = legaDTO.getId();
        String squadra = (String) args.get(SIGLASQUADRA);
        Enumeratori.RuoloGiocatoreLega ruoloGiocatoreLega = legaDTO.getRuoloGiocatoreLega();
        Enumeratori.StatoPartita statoGiornataCorrente = legaDTO.getStatoGiornataCorrente();
        Integer giornata = (Integer) args.get(PARAM.GIORNATA);
        GiocatoreDTO giocatoreDTO= (GiocatoreDTO) args.get(PARAM.IDGIOCATORE);
        Optional<GiocataDTO> attGiocata = giocatoreDTO.getGiocate().stream()
                .filter(g -> g.getGiornata().equals(giornata) && g.getLegaId().equals(legaDTOId))
                .findFirst();

        log.info("legaDTO.getRuoloGiocatoreLega() = {}", ruoloGiocatoreLega);
        log.info("legaDTO.getStatoGiornataCorrente() = {}", statoGiornataCorrente);
        log.info("legaDTO.getGiornataCorrente() = {}", legaDTO.getGiornataCorrente());
        log.info("giornata {}", giornata);
        log.info("giocatore {}", giocatoreDTO);
        log.info("legaDTO.getGiornataIniziale() = {}", legaDTO.getGiornataIniziale());

        if (ruoloGiocatoreLega == Enumeratori.RuoloGiocatoreLega.NESSUNO) {
            throw new AccessDeniedException("Non partecipi alla lega " + legaDTO.getNome());
        }
        if (giocatoreDTO.getStatiPerLega().getOrDefault(legaDTOId, Enumeratori.StatoGiocatore.ELIMINATO) != Enumeratori.StatoGiocatore.ATTIVO){
            throw new AccessDeniedException("Il giocatore " + giocatoreDTO.getId() + " non è attivo ");
        }
        if (!userId.equals(giocatoreDTO.getUser().getId()) && (isAdmin || ruoloGiocatoreLega != Enumeratori.RuoloGiocatoreLega.LEADER)){
            throw new InsufficientAuthenticationException("Solo il leader o admin può giocare per un altro utente");
        }
        if (legaDTO.getGiornataCorrente() != legaDTO.getGiornataIniziale() + giornata -1){
            throw new InsufficientAuthenticationException("Non è la giornata corrente");
        }
        if (attGiocata.isPresent() && attGiocata.get().getEsito() != null){
            throw new InsufficientAuthenticationException("Giocata con esito!");
        }
        if(statoGiornataCorrente == Enumeratori.StatoPartita.SOSPESA){
            throw new InsufficientAuthenticationException("La giornata è sospesa");
        }
        if(statoGiornataCorrente != Enumeratori.StatoPartita.DA_GIOCARE && (isAdmin || ruoloGiocatoreLega != Enumeratori.RuoloGiocatoreLega.LEADER)){
            throw new InsufficientAuthenticationException("Solo il leader o admin può giocare su una giornata non ancora da giocare");
        }
        if (giocatoreDTO.getGiocate().stream()
                .filter(g->g.getLegaId().equals(legaDTOId) && squadra.equals(g.getSquadraSigla()))
                .count()>0){
            throw new InsufficientAuthenticationException("Squadra già usata");
        }
    }

}