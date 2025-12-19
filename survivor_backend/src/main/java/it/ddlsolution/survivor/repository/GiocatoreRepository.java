package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.dto.GiocatoreProjection;
import it.ddlsolution.survivor.entity.Giocatore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GiocatoreRepository extends JpaRepository<Giocatore, Long> {
    @Query("SELECT g.id as id, g.nome as nome, g.user as user FROM Giocatore g WHERE g.user.id = :userId")
    Optional<GiocatoreProjection> findProjectionByUserId(@Param("userId") Long userId);
}

