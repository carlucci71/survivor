package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Campionato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampionatoRepository extends JpaRepository<Campionato, String> {
}

