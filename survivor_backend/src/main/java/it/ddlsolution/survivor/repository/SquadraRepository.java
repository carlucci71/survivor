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
    Optional<Squadra> findBySiglaAndNazione(String sigla, String nazione);

    @Query("SELECT s FROM Squadra s WHERE s.nazione = (SELECT c.nazione FROM Campionato c WHERE c.id = :campionatoId)")
    List<Squadra> findByNazioneOfCampionato(@Param("campionatoId") String campionatoId);

    @Query(nativeQuery = true, value = """
            select * from squadra where sigla in (
 select distinct casa_sigla from partita p, campionato c where id_campionato = c.id
 and c.id = :campionatoId and anno = :anno
 union
 select distinct fuori_sigla from partita p, campionato c where id_campionato = c.id
 and c.id = :campionatoId and anno = :anno
 ) and id_campionato = :campionatoId
 order by nome
""")
    List<Squadra> findByNazioneOfCampionatoAndAnno(@Param("campionatoId") String campionatoId,@Param("anno") short anno);

}
