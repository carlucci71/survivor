package it.ddlsolution.survivor.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.sql.Connection;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * BeanPostProcessor che wrappa il DataSource con un proxy che registra
 * l'acquisizione e il rilascio delle Connection. Non modifica il comportamento
 * della Connection, semplicemente logga quando viene ottenuta e quando viene chiusa.
 *
 * Attenzione: usare solo in fase di debug / test. Disabilitare in produzione se
 * si teme overhead.
 */
@Component
@ConditionalOnProperty(name = "app.datasource.log-connections", havingValue = "true", matchIfMissing = false)
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class DataSourceConnectionLogger implements BeanPostProcessor {

    // Mappa per tenere traccia delle connection proxy aperte e le informazioni di acquisizione
    private final Map<Connection, AcquisitionInfo> openConnections = new ConcurrentHashMap<>();

    // Numero di stack frames da loggare per non intasare i log
    private static final int STACK_FRAMES_TO_LOG = 10;

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof DataSource) {
            DataSource ds = (DataSource) bean;
            // Evitiamo di wrapparci più volte
            if (Proxy.isProxyClass(ds.getClass()) && Proxy.getInvocationHandler(ds) instanceof DataSourceInvocationHandler) {
                return bean;
            }

            DataSource proxy = (DataSource) Proxy.newProxyInstance(
                    ds.getClass().getClassLoader(),
                    new Class[]{DataSource.class},
                    new DataSourceInvocationHandler(ds));

            log.info("DataSource '{}' wrapped for connection logging", beanName);
            return proxy;
        }
        return bean;
    }

    private class DataSourceInvocationHandler implements InvocationHandler {
        private final DataSource delegate;

        DataSourceInvocationHandler(DataSource delegate) {
            this.delegate = delegate;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            String name = method.getName();
            try {
                if ("getConnection".equals(name) && (args == null || args.length == 0)) {
                    Connection real = delegate.getConnection();
                    return wrapConnection(real);
                } else if ("getConnection".equals(name) && args != null && args.length == 2) {
                    Connection real = delegate.getConnection((String) args[0], (String) args[1]);
                    return wrapConnection(real);
                }
            } catch (Throwable t) {
                throw t;
            }
            return method.invoke(delegate, args);
        }

        private Connection wrapConnection(Connection real) {
            InvocationHandler h = new ConnectionInvocationHandler(real);
            Connection proxy = (Connection) Proxy.newProxyInstance(
                    real.getClass().getClassLoader(),
                    new Class[]{Connection.class},
                    h);
            // registra
            AcquisitionInfo info = new AcquisitionInfo(Integer.toHexString(System.identityHashCode(proxy)),Thread.currentThread().getName(), Thread.currentThread().getId(), captureStack());
            openConnections.put(proxy, info);
            logAcquired(proxy, info);
            return proxy;
        }

        private List<String> captureStack() {
            return Arrays.stream(Thread.currentThread().getStackTrace())
                    .skip(3) // skip runtime frames
                    .filter(s->s.toString().indexOf("ddlsolution")>-1)
                    .limit(STACK_FRAMES_TO_LOG)
                    .map(s -> s.toString() + System.lineSeparator())
                    .collect(Collectors.toList());
        }
    }

    private class ConnectionInvocationHandler implements InvocationHandler {
        private final Connection delegate;
        //private final String id;

        ConnectionInvocationHandler(Connection delegate) {
            this.delegate = delegate;
           // this.id = Integer.toHexString(System.identityHashCode(delegate));
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            String name = method.getName();
            if ("close".equals(name) && (args == null || args.length == 0)) {
                AcquisitionInfo info = openConnections.remove(proxy);
                if (info != null) {
                    logReleased(info);
                } else {
                    log.info("Releasing connection (info not found)");
                }
                try {
                    return method.invoke(delegate, args);
                } catch (Throwable t) {
                    throw t;
                }
            }
            try {
                return method.invoke(delegate, args);
            } catch (Throwable t) {
                throw t;
            }
        }
    }

    private void logAcquired(Connection proxy, AcquisitionInfo info) {
        log.info("[CONN-ACQUIRE] id={} thread={} tid={} stack={}", info.id, info.threadName, info.threadId, String.join(" | ", info.stack));

    }

    private void logReleased(AcquisitionInfo info) {
        log.info("[CONN-RELEASE] id={} thread={} tid={} acquiredStack={}", info.id, info.threadName, info.threadId, String.join(" | ", info.stack));
    }

    private static class AcquisitionInfo {
        final String id;
        final String threadName;
        final long threadId;
        final List<String> stack;

        AcquisitionInfo(String id, String threadName, long threadId, List<String> stack) {
            this.id = id;
            this.threadName = threadName;
            this.threadId = threadId;
            this.stack = stack;
        }
    }

    /**
     * Stampa uno snapshot delle connection attualmente aperte.
     * Usare solo per debug; il metodo è thread-safe grazie alla copia dei dati.
     */
    public void logOpenConnections() {
        try {
            Map<Connection, AcquisitionInfo> snapshot = new java.util.HashMap<>(openConnections);
            if (snapshot.isEmpty()) {
                log.info("[CONN-OPENED] none");
                return;
            }

            log.info("[CONN-OPENED] count={}", snapshot.size());
            for (Map.Entry<Connection, AcquisitionInfo> e : snapshot.entrySet()) {
                String id = Integer.toHexString(System.identityHashCode(e.getKey()));
                AcquisitionInfo info = e.getValue();
                log.info("[CONN-OPENED] id={} thread={} tid={} acquiredStack={}", id, info.threadName, info.threadId, String.join(" | ", info.stack));
            }
        } catch (Exception ex) {
            log.warn("Errore durante logOpenConnections", ex);
        }
    }
}
