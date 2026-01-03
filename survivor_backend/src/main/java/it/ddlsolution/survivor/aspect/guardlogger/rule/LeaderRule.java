package it.ddlsolution.survivor.aspect.guardlogger.rule;


import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Map;

import static it.ddlsolution.survivor.aspect.guardlogger.rule.GuardRule.PARAM.LEGA;

@Slf4j
public class LeaderRule implements GuardRule {
    @Override
    public void run(Map<GuardRule.PARAM, Object> args) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InsufficientAuthenticationException("Utente non autenticato");
        }
        Long userId = (Long) authentication.getPrincipal();
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + "ADMIN"));

        LegaDTO legaDTO = (LegaDTO) args.get(LEGA);
        log.info("legaDTO.getRuoloGiocatoreLega() = {}", legaDTO.getRuoloGiocatoreLega());
        if (legaDTO.getRuoloGiocatoreLega() != Enumeratori.RuoloGiocatoreLega.LEADER && !isAdmin) {
            throw new AccessDeniedException("Devi essere admin o Leader della lega " + legaDTO.getId());
        }
    }
}