package it.ddlsolution.survivor.entity.projection;

/**
 * Projection for {@link it.ddlsolution.survivor.entity.Lega}
 */
public interface LegaProjection {
    Long getId();

    String getNome();

    int getGiornataIniziale();

    Integer getGiornataCalcolata();

    CampionatoProjection getCampionato();
}