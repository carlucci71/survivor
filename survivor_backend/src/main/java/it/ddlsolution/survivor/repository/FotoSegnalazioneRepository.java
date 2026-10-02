package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.FotoSegnalazione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FotoSegnalazioneRepository extends JpaRepository<FotoSegnalazione, Long> {

    boolean existsByGiocatoreIdAndSegnalatoreId(Long giocatoreId, Long segnalatoreId);

    long countByGiocatoreId(Long giocatoreId);

    @Modifying
    @Query("DELETE FROM FotoSegnalazione s WHERE s.giocatoreId = :giocatoreId")
    void deleteByGiocatoreId(@Param("giocatoreId") Long giocatoreId);

    @Modifying
    @Query("DELETE FROM FotoSegnalazione s WHERE s.segnalatoreId = :segnalatoreId")
    void deleteBySegnalatoreId(@Param("segnalatoreId") Long segnalatoreId);

    /** Giocatori con almeno una segnalazione aperta sulla propria foto. */
    @Query("SELECT DISTINCT s.giocatoreId FROM FotoSegnalazione s")
    List<Long> findGiocatoriSegnalati();
}
