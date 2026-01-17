package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.PartitaMock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartitaMockRepository extends JpaRepository<PartitaMock, Integer> {


    List<PartitaMock> findByCampionato_IdAndGiornataAndAnno(String idCampionato, int giornata, short anno);
}

