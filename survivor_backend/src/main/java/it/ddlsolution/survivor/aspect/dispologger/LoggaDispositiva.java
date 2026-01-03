package it.ddlsolution.survivor.aspect.dispologger;


import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;

@Target(METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LoggaDispositiva {
    String tipologia() default "";
}
