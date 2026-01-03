package it.ddlsolution.survivor.aspect.dispologger;

import it.ddlsolution.survivor.dto.LogDispositivaDTO;
import it.ddlsolution.survivor.dto.ParamLogDispositivaDTO;
import it.ddlsolution.survivor.exception.BaseResponseException;
import it.ddlsolution.survivor.exception.ExceptionMapperService;
import it.ddlsolution.survivor.service.LogDispositivaService;
import it.ddlsolution.survivor.service.UserService;
import it.ddlsolution.survivor.util.Utility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class LogDispositivaAspect {

    private final Utility utility;
    private final UserService userService;
    private final LogDispositivaService logDispositivaService;
    private final ExceptionMapperService exceptionMapperService;

    @Before("@annotation(loggaDispositiva)")
    public void before(JoinPoint joinPoint, LoggaDispositiva loggaDispositiva) {
//        logJoinPoint(joinPoint, loggaDispositiva, "BEFORE");
    }

    @AfterReturning("@annotation(loggaDispositiva)")
    public void onSuccess(JoinPoint joinPoint, LoggaDispositiva loggaDispositiva) {
        logJoinPoint(joinPoint, loggaDispositiva, "SUCCESS");
    }

    // Bind the thrown exception with `throwing` and accept it as a method parameter
    @AfterThrowing(pointcut = "@annotation(loggaDispositiva)", throwing = "ex")
    public void onError(JoinPoint joinPoint, LoggaDispositiva loggaDispositiva, Throwable ex) {
        logJoinPoint(joinPoint, loggaDispositiva, "ERROR", ex);
    }

    // Backwards-compatible: old method delegates to new implementation
    private void logJoinPoint(JoinPoint joinPoint, LoggaDispositiva loggaDispositiva, String momento) {
        logJoinPoint(joinPoint, loggaDispositiva, momento, null);
    }

    // New implementation that accepts an optional Throwable and logs its message + stacktrace
    private void logJoinPoint(JoinPoint joinPoint, LoggaDispositiva loggaDispositiva, String momento, Throwable ex) {

        log.info("*******************************");
        log.info(momento + " method execution: " + joinPoint.getSignature().toShortString());

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] paramNames = signature.getParameterNames(); // nomi dei parametri (se disponibili)
        Object[] args = joinPoint.getArgs();                 // valori dei parametri
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        LogDispositivaDTO logDispositivaDTO = new LogDispositivaDTO(userService.userById((Long) authentication.getPrincipal()), LocalDateTime.now());
        logDispositivaDTO.setEsito(momento);

        // If an exception is present, use ExceptionMapperService to map it to BaseResponseException
        if (ex != null) {
            BaseResponseException baseResponse = exceptionMapperService.mapToBaseResponse((Exception) ex);

            // build stack trace
            StringWriter sw = new StringWriter();
            ex.printStackTrace(new PrintWriter(sw));
            String stackTrace = sw.toString();

            // Use BaseResponseException data
            String message = baseResponse.getMessage();
            logDispositivaDTO.setMessaggio(message != null ? (message.length() > 1000 ? message.substring(0, 1000) : message) : "Eccezione generica");

            // Log additional info from BaseResponseException
            log.error("ErrorCode: {}, NameClassException: {}, Id: {}",
                    baseResponse.getErrorCode(),
                    baseResponse.getNameClassException(),
                    baseResponse.getId());
            log.error("StackTrace: {}", stackTrace.length() > 2000 ? stackTrace.substring(0, 2000) + "..." : stackTrace);
            logDispositivaDTO.setIdErrore(baseResponse.getId());
        }

        logDispositivaDTO.setTipologia(loggaDispositiva.tipologia());
        List<ParamLogDispositivaDTO> paramsLogDispositiva = new ArrayList<>();
        logDispositivaDTO.setParamLogDispositive(paramsLogDispositiva);
        if (paramNames != null) {
            for (int i = 0; i < paramNames.length; i++) {
                Object arg = (args != null && args.length > i) ? args[i] : null;
                log.info("param {} = {}", paramNames[i], arg);
                String value = arg == null ? "null" : arg.toString();
                String className = arg == null ? "null" : arg.getClass().getName();
                paramsLogDispositiva.add(new ParamLogDispositivaDTO(paramNames[i], value, className));
            }
        } else {
            if (args != null) {
                for (int i = 0; i < args.length; i++) {
                    Object arg = args[i];
                    log.info("arg[{}] = {}", i, arg);
                    String value = arg == null ? "null" : arg.toString();
                    String className = arg == null ? "null" : arg.getClass().getName();
                    paramsLogDispositiva.add(new ParamLogDispositivaDTO(Integer.toString(i), value, className));
                }
            }
        }
        log.info("logDispositivaDTO {}", utility.toJson(logDispositivaDTO));
        logDispositivaService.salva(logDispositivaDTO);
        log.info("tipologia {}", loggaDispositiva.tipologia());
        log.info("*******************************");
    }


}
