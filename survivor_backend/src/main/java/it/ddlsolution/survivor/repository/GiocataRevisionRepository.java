package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Giocata;
import org.springframework.data.repository.history.RevisionRepository;

public interface GiocataRevisionRepository extends RevisionRepository<Giocata, Long, Long> {
}
