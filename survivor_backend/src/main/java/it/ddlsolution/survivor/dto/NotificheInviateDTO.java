package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

@Data
public class NotificheInviateDTO {
    private Long id;
    private CampionatoDTO campionato;
    private short anno = 2025;
    private int giornata;
    private Enumeratori.TipoNotifica tipoNotifica;

}

