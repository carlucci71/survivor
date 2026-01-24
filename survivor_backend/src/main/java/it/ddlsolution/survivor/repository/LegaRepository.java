package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.projection.LegaProjection;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LegaRepository extends JpaRepository<Lega, Long> {
    List<Lega> findByGiocatoreLeghe_Giocatore_User_Id(Long id);

    @Query("SELECT l.id as id, l.name as name, l.anno as anno, l.edizione as edizione, l.stato as stato,l.giornataIniziale as giornataIniziale, " +
           "l.giornataCalcolata as giornataCalcolata, l.campionato as campionato " +
           "FROM Lega l LEFT JOIN l.campionato c LEFT JOIN c.sport s WHERE l.id = :id")
    Optional<LegaProjection> findProjectionById(@Param("id") Long id);

    @Query("select l from Lega l")
    List<LegaProjection> allLeghe();

    Optional<Lega> findByName(String name);

    @Query("SELECT l.edizione FROM Lega l WHERE l.name = :name")
    List<Integer> findEdizioniByName(@Param("name") String name);

    @Query("""
        SELECT l FROM Lega l
        WHERE l.stato = :stato
        AND NOT EXISTS (
            SELECT 1 FROM GiocatoreLega gl
            WHERE gl.lega.id = l.id
            AND gl.giocatore.user.id = :userId
        )
        """)
    List<Lega> findByStatoAndGiocatoreLeghe_Giocatore_UserNot(
            @Param("stato") Enumeratori.StatoLega stato,
            @Param("userId") Long userId
    );

    @Modifying
//    @Transactional
    @Query("DELETE FROM GiocatoreLega gl WHERE gl.lega.id = :idLega AND gl.giocatore.id = :idGiocatore")
    int deleteGiocatoreLegaByLegaIdAndGiocatoreId(@Param("idLega") Long idLega, @Param("idGiocatore") Long idGiocatore);
}
