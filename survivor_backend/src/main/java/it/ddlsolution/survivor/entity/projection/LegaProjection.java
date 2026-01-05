package it.ddlsolution.survivor.entity.projection;

import it.ddlsolution.survivor.util.Enumeratori;

/**
 * Projection for {@link it.ddlsolution.survivor.entity.Lega}
 */
public interface LegaProjection {
    Long getId();
    String getName();
    Integer getEdizione();
    String getPwd();
    Enumeratori.StatoLega getStato();
    int getGiornataIniziale();
    Integer getGiornataCalcolata();
    CampionatoProjection getCampionato();
}