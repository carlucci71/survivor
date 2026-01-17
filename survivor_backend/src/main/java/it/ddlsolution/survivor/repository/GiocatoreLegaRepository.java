package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.GiocatoreLega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface GiocatoreLegaRepository extends JpaRepository<GiocatoreLega, GiocatoreLega.GiocatoreLegaId> {
    List<GiocatoreLega> findByGiocatore_Id(Long giocatoreId);
    List<GiocatoreLega> findByLega_Id(Long legaId);
    Optional<GiocatoreLega> findByGiocatore_IdAndLega_Id(Long giocatoreId, Long legaId);
    Optional<GiocatoreLega> findByLega_IdAndGiocatore_User_Id(Long legaId, Long userId);


}

