package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Giocata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GiocataRepository extends JpaRepository<Giocata, Long> {

    Optional<Giocata> findByGiornataAndGiocatore_IdAndLega_Id(Integer giornata, Long idGiocatore, Long idLega);

    /**
     * Conta il numero di giocate per un giocatore in una lega
     */
    Long countByGiocatore_IdAndLega_Id(Long giocatoreId, Long legaId);

    /**
     * Trova l'ultima giocata di un giocatore in una lega (per giornata)
     */
    Optional<Giocata> findTopByGiocatore_IdAndLega_IdOrderByGiornataDesc(Long giocatoreId, Long legaId);
}

