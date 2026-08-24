package it.ddlsolution.survivor.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.Locale;

/**
 * Traduce i testi delle notifiche push nella lingua preferita del destinatario (colonna
 * users.lingua). I template vivono in src/main/resources/messages_{it,en,es}.properties.
 *
 * Prima di questo servizio tutte le notifiche erano hardcoded in italiano, indipendentemente
 * dalla lingua scelta dall'utente nell'app (che finora era un'impostazione solo frontend, mai
 * comunicata al backend).
 */
@Service
@RequiredArgsConstructor
public class NotificationI18nService {

    private final MessageSource messageSource;

    /** Lingue supportate: qualunque altro valore ricade su "it" (stesso default del frontend). */
    private static final java.util.Set<String> LINGUE_SUPPORTATE = java.util.Set.of("it", "en", "es");

    public String testo(String key, String lingua, Object... args) {
        return messageSource.getMessage(key, args, locale(lingua));
    }

    private Locale locale(String lingua) {
        String l = (ObjectUtils.isEmpty(lingua) || !LINGUE_SUPPORTATE.contains(lingua)) ? "it" : lingua;
        return Locale.forLanguageTag(l);
    }
}
