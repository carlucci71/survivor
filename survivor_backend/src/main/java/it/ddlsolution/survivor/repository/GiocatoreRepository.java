package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.projection.GiocatoreProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GiocatoreRepository extends JpaRepository<Giocatore, Long> {
    @Query("SELECT g.id as id, g.nome as nome, g.nickname as nickname, g.squadraCuore as squadraCuore, g.user as user FROM Giocatore g WHERE g.user.id = :userId")
    Optional<GiocatoreProjection> findProjectionByUserId(@Param("userId") Long userId);

    @Query("""
            select g from Giocatore g inner join g.giocatoreLeghe giocatoreLeghe
            where giocatoreLeghe.lega.id = ?1 and g.user.id = ?2""")
    Optional<Giocatore> findByGiocatoreLeghe_Lega_IdAndUser_Id(Long legaId, Long userId);

    Optional<Giocatore> findByUser_Id(Long userId);

    void deleteByUser_Id(Long userId);


}

