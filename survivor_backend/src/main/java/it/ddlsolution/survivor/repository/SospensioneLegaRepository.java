package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.SospensioneLega;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SospensioneLegaRepository extends JpaRepository<SospensioneLega, SospensioneLega.SospensioneLegaId> {
    long deleteById_IdLegaAndId_Giornata(Long idLega,Integer giornata);
}

