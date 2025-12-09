package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Squadra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SquadraRepository extends JpaRepository<Squadra, String> {
    List<Squadra> findByCampionato_Id(String campionatoId);
}

