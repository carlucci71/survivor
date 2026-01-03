package it.ddlsolution.survivor.aspect.guardlogger;

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
public class GuardiaDispositivaAspect {

    private final Utility utility;
    private final UserService userService;
    private final ExceptionMapperService exceptionMapperService;

    @Before("@annotation(guardiaDispositiva)")
    public void before(JoinPoint joinPoint, GuardiaDispositiva guardiaDispositiva) {
        logJoinPoint(joinPoint, guardiaDispositiva);
    }

    private void logJoinPoint(JoinPoint joinPoint, GuardiaDispositiva guardiaDispositiva) {

        log.info("*******************************");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("authentication.getAuthorities() = " + authentication.getAuthorities());
        System.out.println("guardiaDispositiva.idLega() = " + guardiaDispositiva.idLega());
    }


}
