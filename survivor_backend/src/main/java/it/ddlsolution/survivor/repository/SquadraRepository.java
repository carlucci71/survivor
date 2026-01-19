package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Squadra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SquadraRepository extends JpaRepository<Squadra, String> {
    Optional<Squadra> findBySiglaAndCampionato_Id(String sigla, String campionatoId);

    @Query("SELECT s FROM Squadra s WHERE s.nazione = (SELECT c.nazione FROM Campionato c WHERE c.id = :campionatoId)")
    List<Squadra> findByNazioneOfCampionato(@Param("campionatoId") String campionatoId);

}
