package it.ddlsolution.survivor.entity.projection;

import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.entity.User;

public interface GiocatoreProjection {
    Long getId();
    String getNome();
    String getNickname();
    Squadra getSquadraCuore();
    User getUser();
}

