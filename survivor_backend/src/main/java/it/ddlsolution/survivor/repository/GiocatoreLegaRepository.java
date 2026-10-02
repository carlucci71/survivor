package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.GiocatoreLega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GiocatoreLegaRepository extends JpaRepository<GiocatoreLega, GiocatoreLega.GiocatoreLegaId> {
    List<GiocatoreLega> findByGiocatore_Id(Long giocatoreId);
    List<GiocatoreLega> findByLega_Id(Long legaId);
    Optional<GiocatoreLega> findByGiocatore_IdAndLega_Id(Long giocatoreId, Long legaId);
    Optional<GiocatoreLega> findByLega_IdAndGiocatore_User_Id(Long legaId, Long userId);

    @Query("SELECT COUNT(gl) FROM GiocatoreLega gl WHERE gl.lega.id = :legaId")
    int countPartecipantiByLegaId(@Param("legaId") Long legaId);

    /** Quante leghe hanno in comune due giocatori (la foto profilo e' visibile solo a chi ne condivide almeno una). */
    @Query("SELECT COUNT(gl1) FROM GiocatoreLega gl1, GiocatoreLega gl2 "
            + "WHERE gl1.giocatore.id = :a AND gl2.giocatore.id = :b AND gl1.lega.id = gl2.lega.id")
    long countLegheInComune(@Param("a") Long a, @Param("b") Long b);

}

