package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Giocatore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GiocatoreRepository extends JpaRepository<Giocatore, Long> {
    Optional<Giocatore> findByUser_Id(Long id);
}

