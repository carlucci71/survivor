package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Lega;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface LegaRepository extends CrudRepository<Lega, Long> {
    List<Lega> findByGiocatori_User_Id(Long id);
}