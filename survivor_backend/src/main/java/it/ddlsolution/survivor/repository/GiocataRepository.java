package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Giocata;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GiocataRepository extends JpaRepository<Giocata, Long> {

    Optional<Giocata> findByGiornataAndGiocatore_IdAndLega_Id(Integer giornata, Long idGiocatore, Long idLega);


    /**
     * Trova l'ultima giocata di un giocatore in una lega (per giornata)
     */
    Optional<Giocata> findTopByGiocatore_IdAndLega_IdOrderByGiornataDesc(Long giocatoreId, Long legaId);

    /**
     * Tutte le giocate di una lega per una specifica giornata (relativa)
     */
    List<Giocata> findByGiornataAndLega_Id(Integer giornata, Long legaId);

    /**
     * Controlla se un giocatore aveva una KO in una giornata precedente (era già eliminato)
     */
    boolean existsByGiocatore_IdAndLega_IdAndGiornataLessThanAndEsito(
            Long giocatoreId, Long legaId, Integer giornata, Enumeratori.EsitoGiocata esito);
}

