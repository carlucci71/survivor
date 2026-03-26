package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.ReactionGiocata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionGiocataRepository extends JpaRepository<ReactionGiocata, Long> {

    List<ReactionGiocata> findByGiocata_Id(Long giocataId);

    Optional<ReactionGiocata> findByGiocata_IdAndGiocatore_Id(Long giocataId, Long giocatoreId);

    void deleteByGiocata_IdAndGiocatore_Id(Long giocataId, Long giocatoreId);

    void deleteByGiocata_Id(Long giocataId);

    @Query("SELECT r FROM ReactionGiocata r WHERE r.giocata.id IN :giocataIds")
    List<ReactionGiocata> findByGiocataIds(@Param("giocataIds") List<Long> giocataIds);
}
