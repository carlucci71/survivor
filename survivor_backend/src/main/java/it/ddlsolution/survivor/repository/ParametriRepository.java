package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Parametri;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParametriRepository extends JpaRepository<Parametri, Integer> {
    Optional<Parametri> findByCodice(Enumeratori.CodiciParametri codice);
}

