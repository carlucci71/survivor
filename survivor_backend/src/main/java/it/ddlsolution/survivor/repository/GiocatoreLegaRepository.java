package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.GiocatoreLega;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface GiocatoreLegaRepository extends CrudRepository<GiocatoreLega, GiocatoreLega.GiocatoreLegaId> {
    List<GiocatoreLega> findByGiocatore_Id(Long giocatoreId);
    List<GiocatoreLega> findByLega_Id(Long legaId);
    Optional<GiocatoreLega> findByGiocatore_IdAndLega_Id(Long giocatoreId, Long legaId);
}

