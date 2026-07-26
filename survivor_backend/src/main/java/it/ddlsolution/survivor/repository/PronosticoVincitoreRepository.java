package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.PronosticoVincitore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PronosticoVincitoreRepository extends JpaRepository<PronosticoVincitore, Long> {
    Optional<PronosticoVincitore> findByLega_IdAndGiocatore_Id(Long legaId, Long giocatoreId);
    List<PronosticoVincitore> findByGiocatore_Id(Long giocatoreId);
    List<PronosticoVincitore> findByLega_Id(Long legaId);
}
