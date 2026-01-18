package it.ddlsolution.survivor.entity;

import org.hibernate.envers.RevisionListener;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class RevInfoListener implements RevisionListener {

    @Override
    public void newRevision(Object revisionEntity) {
        RevInfo revInfo = (RevInfo) revisionEntity;

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal())) {

            Object principal = authentication.getPrincipal();

            // Se il principal è l'ID dell'utente (come nel JWT filter)
            if (principal instanceof Long) {
                Long userId = (Long) principal;
                revInfo.setUserId(userId);
                revInfo.setUsername("User-" + userId);
            } else if (principal instanceof String) {
                revInfo.setUsername((String) principal);
            }
        } else {
            revInfo.setUsername("SYSTEM");
        }
    }
}
