package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.GiocataSnapshot;
import it.ddlsolution.survivor.entity.GiocataSnapshotId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public interface GiocataSnapshotRepository extends JpaRepository<GiocataSnapshot, GiocataSnapshotId> {

    @Query("select s from GiocataSnapshot s where s.giocataId = :giocataId and s.revisionNumber = :revisionNumber")
    List<GiocataSnapshot> findByGiocataIdAndRevisionNumber(@Param("giocataId") Long giocataId, @Param("revisionNumber") Long revisionNumber);

    default Map<String, String> findSnapshotMap(Long giocataId, Long revisionNumber) {
        List<GiocataSnapshot> list = findByGiocataIdAndRevisionNumber(giocataId, revisionNumber);
        return list.stream().collect(Collectors.toMap(GiocataSnapshot::getColumnName, GiocataSnapshot::getColumnValue));
    }
}
