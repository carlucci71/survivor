package it.ddlsolution.survivor.entity;

import lombok.Data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

/*
 Entity that maps a separate audit table storing snapshot fields for Giocata.
 This table is read-only for our purposes; we only query it to enrich revisions.
 Assumption: table name is `giocata_snapshot_aud` with columns (giocata_id, revision_number, column_name, column_value)
 If your actual table schema differs, adjust the mapping accordingly.
*/

@Data
@Entity
@Table(name = "giocata_snapshot_aud")
@IdClass(GiocataSnapshotId.class)
public class GiocataSnapshot {

    @Id
    @Column(name = "giocata_id")
    private Long giocataId;

    @Id
    @Column(name = "revision_number")
    private Long revisionNumber;

    @Id
    @Column(name = "column_name")
    private String columnName;

    @Column(name = "column_value")
    private String columnValue;
}
