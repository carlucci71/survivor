package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Partita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartitaRepository extends JpaRepository<Partita, Integer> {

    Optional<Partita> findByCampionato_IdAndGiornataAndImplementationExternalApiAndCasaSiglaAndFuoriSiglaAndAnno(
            String campionatoId, int giornata, String implementationExternalApi, String casaSigla, String fuoriSigla, short anno);

    List<Partita> findByCampionato_IdAndGiornataAndImplementationExternalApiAndAnno(String campionatoId, int giornata, String implementationExternalApi, short anno);
    List<Partita> findByCampionato_IdAndImplementationExternalApiAndAnno(String campionatoId, String implementationExternalApi, short anno);


}

