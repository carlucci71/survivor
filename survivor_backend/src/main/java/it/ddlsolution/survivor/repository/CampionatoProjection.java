package it.ddlsolution.survivor.repository;

/**
 * Projection for {@link it.ddlsolution.survivor.entity.Campionato}
 */
public interface CampionatoProjection {
    String getId();
    String getNome();

    int getNumGiornate();

    SportProjection getSport();
}