package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.entity.User;

public interface GiocatoreProjection {
    Long getId();
    String getNome();
    User getUser();
}

