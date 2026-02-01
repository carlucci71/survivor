package it.ddlsolution.survivor.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class GiocataSnapshotId implements Serializable {
    private Long giocataId;
    private Long revisionNumber;
    private String columnName;
}
