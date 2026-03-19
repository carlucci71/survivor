package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.LegaJoinRequest;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LegaJoinRequestRepository extends JpaRepository<LegaJoinRequest, Long> {

    List<LegaJoinRequest> findByLega_IdAndStato(Long legaId, Enumeratori.StatoRichiesta stato);

    Optional<LegaJoinRequest> findByLega_IdAndGiocatore_Id(Long legaId, Long giocatoreId);

    boolean existsByLega_IdAndGiocatore_IdAndStato(Long legaId, Long giocatoreId, Enumeratori.StatoRichiesta stato);

    int countByLega_IdAndStato(Long legaId, Enumeratori.StatoRichiesta stato);

    List<LegaJoinRequest> findByGiocatore_Id(Long giocatoreId);

    List<LegaJoinRequest> findByLega_IdIn(List<Long> legaIds);
}
