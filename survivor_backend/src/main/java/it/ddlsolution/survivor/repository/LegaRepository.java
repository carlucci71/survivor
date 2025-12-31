package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.projection.LegaProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LegaRepository extends JpaRepository<Lega, Long> {
    List<Lega> findByGiocatoreLeghe_Giocatore_User_Id(Long id);

    @Query("SELECT l.id as id, l.nome as nome, l.stato as stato,l.giornataIniziale as giornataIniziale, " +
           "l.giornataCalcolata as giornataCalcolata, l.campionato as campionato " +
           "FROM Lega l LEFT JOIN l.campionato c LEFT JOIN c.sport s WHERE l.id = :id")
    Optional<LegaProjection> findProjectionById(@Param("id") Long id);

    @Query("select l from Lega l")
    List<LegaProjection> allLeghe();

    Optional<Lega> findByNome(String nome);
}

