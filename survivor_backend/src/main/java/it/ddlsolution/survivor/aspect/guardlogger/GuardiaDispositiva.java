package it.ddlsolution.survivor.aspect.guardlogger;

import it.ddlsolution.survivor.aspect.guardlogger.rule.GuardRule;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;

@Target(METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface GuardiaDispositiva {
    String idLegaParam() default "";
    String giornataParam() default "";
    String giocatoreParam() default "";
    String siglaSquadraParam() default "";
    String esitoParam() default "";
    Class<? extends GuardRule> rule();
}
