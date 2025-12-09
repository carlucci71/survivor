package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Giocata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GiocataRepository extends JpaRepository<Giocata, Long> {
}

