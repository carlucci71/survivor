package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.GiocatoreLega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrofeiRepository extends JpaRepository<GiocatoreLega, GiocatoreLega.GiocatoreLegaId> {

    /**
     * Trova tutti i trofei (leghe terminate con posizione finale) di un giocatore
     */
    @Query("""
        SELECT gl
        FROM GiocatoreLega gl
        JOIN FETCH gl.lega l
        JOIN FETCH l.campionato c
        JOIN FETCH c.sport s
        WHERE gl.giocatore.id = :giocatoreId
        AND gl.posizioneFinale IS NOT NULL
        AND l.stato = 'T' 
        ORDER BY l.anno DESC, l.edizione DESC, gl.posizioneFinale ASC
    """)
    List<GiocatoreLega> findTrofeiByGiocatoreId(@Param("giocatoreId") Long giocatoreId);

    /**
     * Conta le vittorie (primo posto) di un giocatore
     */
    @Query("""
        SELECT COUNT(gl)
        FROM GiocatoreLega gl
        WHERE gl.giocatore.id = :giocatoreId
        AND gl.posizioneFinale = 1
    """)
    Long countVittorieByGiocatoreId(@Param("giocatoreId") Long giocatoreId);

    /**
     * Conta i podi (primi 3 posti) di un giocatore
     */
    @Query("""
        SELECT COUNT(gl)
        FROM GiocatoreLega gl
        WHERE gl.giocatore.id = :giocatoreId
        AND gl.posizioneFinale <= 3
    """)
    Long countPodiByGiocatoreId(@Param("giocatoreId") Long giocatoreId);

    /**
     * Conta i tornei totali giocati (leghe terminate) di un giocatore
     */
    @Query("""
        SELECT COUNT(gl)
        FROM GiocatoreLega gl
        JOIN gl.lega l
        WHERE gl.giocatore.id = :giocatoreId
        AND l.stato = it.ddlsolution.survivor.util.enums.Enumeratori.StatoLega.TERMINATA
    """)
    Long countTorneiGiocatiByGiocatoreId(@Param("giocatoreId") Long giocatoreId);
}
