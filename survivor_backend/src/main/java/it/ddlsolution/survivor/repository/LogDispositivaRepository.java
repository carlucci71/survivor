package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.LogDispositiva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LogDispositivaRepository extends JpaRepository<LogDispositiva, Long> {

    @Modifying
    @Query(value = "DELETE FROM param_log_dispositiva WHERE id_log_dispositiva IN (SELECT id FROM log_dispositiva WHERE user_id = :userId)", nativeQuery = true)
    void deleteParamLogDispositivaByUserId(@Param("userId") Long userId);

    @Modifying
    @Query(value = "DELETE FROM log_dispositiva WHERE user_id = :userId", nativeQuery = true)
    void deleteByUserId(@Param("userId") Long userId);
}

