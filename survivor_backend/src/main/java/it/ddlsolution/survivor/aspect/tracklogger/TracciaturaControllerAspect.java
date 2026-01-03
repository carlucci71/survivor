package it.ddlsolution.survivor.aspect.tracklogger;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;

//@Aspect
//@Component
@Slf4j
public class TracciaturaControllerAspect {


    @Around("execution(* it.ddlsolution.survivor.controller.*.*(..))")
    public Object test(ProceedingJoinPoint joinPoint) throws Throwable {
        log.info("----------------------------------------");
        log.info("Controller execution:" + joinPoint.getSignature().toShortString());
        log.info("----------------------------------------");
        try {
            return joinPoint.proceed();
        } finally {
        }

    }

}
