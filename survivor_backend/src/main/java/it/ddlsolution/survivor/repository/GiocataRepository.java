package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Giocata;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.Lega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GiocataRepository extends JpaRepository<Giocata, Long> {

    Optional<Giocata> findByGiornataAndGiocatoreAndLega(Integer giornata, Giocatore giocatore, Lega lega);
}

