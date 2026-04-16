package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.VitaPersa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VitaPersaRepository extends JpaRepository<VitaPersa, Long> {

    List<VitaPersa> findByGiocatore_IdAndLega_IdOrderByGiornataAsc(Long giocatoreId, Long legaId);

    List<VitaPersa> findByLega_IdOrderByGiornataAscGiocatore_IdAsc(Long legaId);
}
