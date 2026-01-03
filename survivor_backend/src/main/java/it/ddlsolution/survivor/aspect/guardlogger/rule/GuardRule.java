package it.ddlsolution.survivor.aspect.guardlogger.rule;

import java.util.Map;

public interface GuardRule {
    enum PARAM{LEGA,GIORNATA,GIOCATORE,SQUADRA}
    void run(Map<GuardRule.PARAM, Object> args);


}