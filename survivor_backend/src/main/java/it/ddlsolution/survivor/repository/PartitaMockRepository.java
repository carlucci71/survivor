package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.PartitaMock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PartitaMockRepository extends JpaRepository<PartitaMock, Integer> {
    List<PartitaMock> findByCampionato_IdAndGiornataAndAnno(String idCampionato, int giornata, short anno);

    @Transactional
    @Modifying
    @Query("""
            update PartitaMock p set p.scoreCasa = :scoreCasa, p.scoreFuori = :scoreFuori 
            where p.campionato.id = :idCampionato 
            and p.anno = :anno 
            and p.giornata = :giornata 
            and p.casaSigla = :casaSigla 
            and p.fuoriSigla = :fuoriSigla 
            """)
    int updateScoreByCampionato (@Param("scoreCasa") Integer scoreCasa, @Param("scoreFuori") Integer scoreFuori
                    , @Param("idCampionato") String idCampionato, @Param("anno") short anno, @Param("giornata") Integer giornata
                    , @Param("casaSigla") String casaSigla, @Param("fuoriSigla") String fuoriSigla);

    @Transactional
    @Modifying
    @Query("""
            update PartitaMock p set p.orario = :orario 
            where p.campionato.id = :idCampionato 
            and p.anno = :anno 
            and p.giornata = :giornata 
            and p.casaSigla = :casaSigla 
            and p.fuoriSigla = :fuoriSigla 
            """)
    int updateOrarioByCampionato(@Param("orario") LocalDateTime orario
            , @Param("idCampionato") String idCampionato, @Param("anno") short anno, @Param("giornata") Integer giornata
            , @Param("casaSigla") String casaSigla, @Param("fuoriSigla") String fuoriSigla);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO partita_mock (id_campionato, giornata, orario, casa_sigla, fuori_sigla, score_casa, score_fuori, anno) " +
            "SELECT p.id_campionato, p.giornata, p.orario, p.casa_sigla, p.fuori_sigla, p.score_casa, p.score_fuori, p.anno " +
            "FROM partita p WHERE p.implementation_external_api = :implementazioneApiFrom AND p.id_campionato = :idCampionato AND p.anno = :anno",
            nativeQuery = true)
    int ribaltaCampionatoInMock(@Param("idCampionato") String idCampionato, @Param("anno") short anno,@Param("implementazioneApiFrom") String implementazioneApiFrom);

    @Transactional
    @Modifying
    @Query("delete from PartitaMock p where p.campionato.id = ?1 and p.anno = ?2")
    int deleteByCampionatoAndAnno(String idCampionato, short anno);

    List<PartitaMock> findByCampionato_IdAndAnnoAndGiornata(String idCampionato, short anno, int giornata);


}
