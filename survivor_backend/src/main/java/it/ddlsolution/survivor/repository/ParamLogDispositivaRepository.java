package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.LogDispositiva;
import it.ddlsolution.survivor.entity.ParamLogDispositiva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParamLogDispositivaRepository extends JpaRepository<ParamLogDispositiva, Long> {
}

