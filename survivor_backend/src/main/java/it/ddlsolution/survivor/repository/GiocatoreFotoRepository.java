package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.GiocatoreFoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GiocatoreFotoRepository extends JpaRepository<GiocatoreFoto, Long> {

    /** Foto nascoste in automatico o con caricamento bloccato: servono alla lista dell'admin. */
    List<GiocatoreFoto> findByNascostaTrueOrBloccataTrue();
}
