package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Campionato;
import it.ddlsolution.survivor.entity.Partita;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartitaRepository extends JpaRepository<Partita, Integer> {

    /**
     * Trova la partita di un campionato/anno/giornata in cui la squadra (sigla)
     * gioca come casa o come trasferta. Usato da GiocataService per bloccare la quota.
     */
    @Query("select p from Partita p where p.campionato.id = :campionatoId and p.anno = :anno and p.giornata = :giornata and (p.casaSigla = :sigla or p.fuoriSigla = :sigla)")
    Optional<Partita> findByGiornataAndSquadra(@Param("campionatoId") String campionatoId, @Param("anno") short anno, @Param("giornata") int giornata, @Param("sigla") String sigla);

    Optional<Partita> findByCampionato_IdAndGiornataAndImplementationExternalApiAndCasaSiglaAndFuoriSiglaAndAnno(
            String campionatoId, int giornata, String implementationExternalApi, String casaSigla, String fuoriSigla, short anno
    );

    List<Partita> findByCampionato_IdAndImplementationExternalApiAndAnno(String campionatoId, String implementationExternalApi, short anno);


    @Transactional
    @Modifying
    @Query("delete from Partita p where p.campionato.id = ?1 and p.anno = ?2 and p.implementationExternalApi = ?3")
    int deleteByCampionatoAndAnnoAndImplementationExternalApi(String idCampionato, short anno, String implementationExternalApi);

    @Transactional
    @Modifying
    @Query("""
            update Partita p set p.stato = ?1
            where p.campionato.id = ?2
            and anno = ?3
            and giornata = ?4
            and implementationExternalApi = ?5
            """)
    int updateStatoByCampionato(Enumeratori.StatoPartita stato, String campionatoId, short anno, int giornata, String implementationExternalApi);
}

