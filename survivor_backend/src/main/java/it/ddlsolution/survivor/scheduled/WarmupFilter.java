package it.ddlsolution.survivor.scheduled;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro che risponde 503 Service Unavailable alle richieste REST finché
 * il servizio di warmup non ha segnato l'applicazione come ready.
 *
 * Nota: esclude endpoint che devono essere raggiungibili anche in fase di warmup
 * come health/readiness check dell'infrastruttura (es. /actuator/health, /actuator/ready, /ping).
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class WarmupFilter extends OncePerRequestFilter {

    private final WarmupService warmupService;

    public WarmupFilter(WarmupService warmupService) {
        this.warmupService = warmupService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // Escludi health/readiness e risorse statiche
        if (path.startsWith("/actuator") || path.equals("/ping") || path.startsWith("/swagger") || path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui")) {
            return true;
        }
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (!warmupService.isReady()) {
            // Restituisci 503 con header Retry-After per i client
            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            response.setHeader("Retry-After", "10");
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Service warming up. Retry later.\"}");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
