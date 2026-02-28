package it.ddlsolution.survivor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Data
@Builder
public class PartitaDTO {
    // Lombok non gestisce getter/setter per 'forzata'
    private String sportId;
    private String campionatoId;
    private int giornata;
    private LocalDateTime orario;
    private Enumeratori.StatoPartita stato;
    private String casaNome;
    private String fuoriNome;
    private String casaSigla;
    private String fuoriSigla;
    private Integer scoreCasa;
    private Integer scoreFuori;
    private String aliasGiornataCasa;
    private String aliasGiornataFuori;
    private short anno;
    @Getter(onMethod_=@JsonProperty("forzata"))
    private boolean forzata;

    public boolean getForzata() {
        return forzata;
    }

    public void setForzata(boolean forzata) {
        this.forzata = forzata;
    }
}
