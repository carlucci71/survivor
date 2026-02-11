package it.ddlsolution.survivor.entity.projection;

import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.entity.User;

public interface GiocatoreProjection {
    Long getId();
    String getNickname();
    Squadra getSquadraCuore();
    Squadra getSquadraBasketCuore();
    Squadra getTennistaCuore();
    User getUser();
}

