package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Parametri;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParametriRepository extends JpaRepository<Parametri, Integer> {

}

