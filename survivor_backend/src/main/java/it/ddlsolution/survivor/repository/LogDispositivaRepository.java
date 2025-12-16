package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.LogDispositiva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogDispositivaRepository extends JpaRepository<LogDispositiva, Long> {
}

