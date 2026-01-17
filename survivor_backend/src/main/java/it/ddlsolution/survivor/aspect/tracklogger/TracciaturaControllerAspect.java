package it.ddlsolution.survivor.aspect.tracklogger;

import it.ddlsolution.survivor.dto.ParamLogDispositivaDTO;
import it.ddlsolution.survivor.util.Utility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class TracciaturaControllerAspect {

    private final Utility utility;

    @Around("execution(* it.ddlsolution.survivor.controller.*.*(..))")
    public Object test(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        StringBuffer sb = new StringBuffer(signature.toShortString());
        try {
            Object[] args = joinPoint.getArgs();                 // valori dei parametri
            String[] paramNames = signature.getParameterNames(); // nomi dei parametri (se disponibili)
            if (paramNames != null) {
                for (int i = 0; i < paramNames.length; i++) {
                    Object arg = (args != null && args.length > i) ? args[i] : null;
//                log.info("param {} = {}", paramNames[i], arg);
                    String value = arg == null ? "null" : arg.toString();
                    sb.append(paramNames[i] + " = " + value);
                }
            } else {
                if (args != null) {
                    for (int i = 0; i < args.length; i++) {
                        Object arg = args[i];
//                    log.info("arg[{}] = {}", i, arg);
                        String value = arg == null ? "null" : arg.toString();
                        sb.append(arg + " = " + value);
                    }
                }
            }
        } catch (Exception e) {
        }
        StopWatch stopWatch = utility.startStopWatch(sb.toString());
        Object proceed = joinPoint.proceed();
        utility.stopStopWatch(stopWatch, false);
        log.info("Controller execution:" + stopWatch.getId() + " response in " + stopWatch.getTotalTimeMillis() + " ms");
        return proceed;

    }

}
