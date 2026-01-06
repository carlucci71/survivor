package it.ddlsolution.survivor.aspect.guardlogger.rule;

import org.springframework.stereotype.Component;

import java.util.Map;

public interface GuardRule {
    enum PARAM{IDLEGA,GIORNATA, IDGIOCATORE, SIGLASQUADRA}
    void run(Map<GuardRule.PARAM, Object> args);


}