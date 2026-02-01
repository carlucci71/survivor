package it.ddlsolution.survivor.aspect.guardlogger;

import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.Map;

/**
 * Utility class per passare dati dalla GuardiaDispositiva al Controller
 * Thread-safe: utilizza RequestContextHolder di Spring che isola i dati per thread tramite ThreadLocal
 */
public class GuardContextHolder {

    private static final String GUARD_RETURN_ATTRIBUTE = "GUARD_RETURN_DATA";

    /**
     * Costruttore privato per impedire l'istanziazione della utility class
     */
    private GuardContextHolder() {
        throw new UnsupportedOperationException("Questa è una utility class e non può essere istanziata");
    }

    /**
     * Salva la mappa restituita dalla guard rule nel contesto della request
     */
    public static void setGuardReturn(Map<String, Object> guardReturn) {
        if (guardReturn != null && !guardReturn.isEmpty()) {
            RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
            if (requestAttributes != null) {
                requestAttributes.setAttribute(GUARD_RETURN_ATTRIBUTE, guardReturn, RequestAttributes.SCOPE_REQUEST);
            }
        }
    }

    /**
     * Recupera la mappa restituita dalla guard rule dal contesto della request
     */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> getGuardReturn() {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes != null) {
            Object attribute = requestAttributes.getAttribute(GUARD_RETURN_ATTRIBUTE, RequestAttributes.SCOPE_REQUEST);
            if (attribute instanceof Map) {
                return (Map<String, Object>) attribute;
            }
        }
        return null;
    }

    /**
     * Rimuove la mappa dal contesto (opzionale, viene pulito automaticamente)
     */
    public static void clear() {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes != null) {
            requestAttributes.removeAttribute(GUARD_RETURN_ATTRIBUTE, RequestAttributes.SCOPE_REQUEST);
        }
    }
}
