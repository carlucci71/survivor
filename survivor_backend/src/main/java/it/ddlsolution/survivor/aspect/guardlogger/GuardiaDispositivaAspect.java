package it.ddlsolution.survivor.aspect.guardlogger;

import it.ddlsolution.survivor.aspect.guardlogger.rule.GuardRule;
import it.ddlsolution.survivor.service.GiocatoreService;
import it.ddlsolution.survivor.service.LegaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.PropertyAccessorFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class GuardiaDispositivaAspect {

    private final LegaService legaService;
    private final GiocatoreService giocatoreService;

    @Before("@annotation(guardiaDispositiva)")
    public void before(JoinPoint joinPoint, GuardiaDispositiva guardiaDispositiva) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        GuardiaDispositiva ann = method.getAnnotation(GuardiaDispositiva.class);
        log.info("*******************************");
        String[] paramNames = signature.getParameterNames(); // nomi dei parametri (se disponibili)
        Object[] args = joinPoint.getArgs();                 // valori dei parametri
        Map<GuardRule.PARAM, Object> parametriRule = new HashMap<>();
        for (GuardRule.PARAM param : GuardRule.PARAM.values()) {
            addParameterInMap(parametriRule, paramNames, args, guardiaDispositiva, param);
        }
        GuardRule rule = resolveRule(guardiaDispositiva);
        rule.run(parametriRule);
    }

    private @NonNull Map<GuardRule.PARAM, Object> addParameterInMap(Map<GuardRule.PARAM, Object> parametriRule, String[] paramNames, Object[] args, GuardiaDispositiva guardiaDispositiva, GuardRule.PARAM tipoParam) {
        String param = switch (tipoParam) {
            case IDLEGA -> guardiaDispositiva.idLegaParam();
            case GIORNATA -> guardiaDispositiva.giornataParam();
            case IDGIOCATORE -> guardiaDispositiva.idGiocatoreParam();
            case SIGLASQUADRA -> guardiaDispositiva.siglaSquadraParam();
        };

        if (!ObjectUtils.isEmpty(param)) {
            String[] splitParam = param.split("\\.");
            if (!ObjectUtils.isEmpty(splitParam[0])) {
                Object argsByParameterName = getArgsByParameterName(paramNames, splitParam, args);
                switch (tipoParam) {
                    case IDLEGA -> {
                        Long idLega = Long.parseLong(argsByParameterName.toString());
                        if (ObjectUtils.isEmpty(idLega)) {
                            throw new RuntimeException("Lega non presente");
                        }
                        parametriRule.put(tipoParam, legaService.getLegaDTO(idLega, false));
                    }
                    case GIORNATA -> {
                        Integer giornata = Integer.parseInt(argsByParameterName.toString());
                        if (ObjectUtils.isEmpty(giornata)) {
                            throw new RuntimeException("Giornata non presente");
                        }
                        parametriRule.put(tipoParam, giornata);
                    }
                    case IDGIOCATORE -> {
                        Long idGiocatore = Long.parseLong(argsByParameterName.toString());
                        if (ObjectUtils.isEmpty(idGiocatore)) {
                            throw new RuntimeException("Giocatore non presente");
                        }
                        parametriRule.put(tipoParam, giocatoreService.find(idGiocatore));
                    }
                    case SIGLASQUADRA -> {
                        String siglaSquadra = argsByParameterName.toString();
                        if (ObjectUtils.isEmpty(siglaSquadra)) {
                            throw new RuntimeException("Squadra non presente");
                        }
                        parametriRule.put(tipoParam, siglaSquadra);
                    }
                    default -> throw new RuntimeException("Param non configurato: " + tipoParam);
                }


            }
        }
        return parametriRule;
    }

    private Object getArgsByParameterName(String[] paramNames, String key[], Object[] args) {
        for (int i = 0; i < paramNames.length; i++) {
            if (paramNames[i].equals(key[0])) {
                Object arg = args[i];
                if (key.length > 1) {
                    BeanWrapper bw = PropertyAccessorFactory.forBeanPropertyAccess(arg);
                    return bw.getPropertyValue(key[1]);
                } else {
                    String value = arg == null ? "null" : arg.toString();
                    return value;
                }
            }
        }
        return null;
    }

    private GuardRule resolveRule(GuardiaDispositiva g) {
        try {
            Class<? extends GuardRule> rc = g.rule();
            if (rc == null) {
                throw new RuntimeException("NON TROVATA");
            }
            return rc.newInstance();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
