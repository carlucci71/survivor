package it.ddlsolution.survivor.dto;

import lombok.Data;

@Data
public class RankingTennisDTO {
    private String id;
    private String displayName;
    private String firstName;
    private String lastName;
    private String nationality;
    private Integer rank;
    private Integer points;
}
