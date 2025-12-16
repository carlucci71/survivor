package it.ddlsolution.survivor.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class TracciaturaDispositivaAspect {


    @Around("execution(* it.ddlsolution.survivor.controller.*.*(..))")
    public Object test(ProceedingJoinPoint joinPoint) throws Throwable {

//        MDC.put("service", point.getSignature().getDeclaringTypeName());
//        MDC.put("function", point.getSignature().getName());
        log.info("----------------------------------------");
        log.info("Controller execution:" + joinPoint.getSignature().toShortString());
        log.info("----------------------------------------");
        try {
            return joinPoint.proceed();
        } finally {
        }

    }

}
