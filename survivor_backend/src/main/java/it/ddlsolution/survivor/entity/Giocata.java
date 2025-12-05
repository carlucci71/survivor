package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import it.ddlsolution.survivor.converter.EsitoGiocataConverter;
import it.ddlsolution.survivor.converter.StatoGiocatoreConverter;
import it.ddlsolution.survivor.util.enumeratori;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "giocata")
@Data
public class Giocata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "giornata", nullable = false)
    private Integer giornata;

    @ManyToOne
    @JoinColumn(name = "id_giocatore", nullable = false)
    @JsonBackReference("giocatore-giocate")
    @ToString.Exclude
    private Giocatore giocatore;

    @ManyToOne
    @JoinColumn(name = "id_squadra", nullable = false)
    private Squadra squadra;

    @Column(name = "esito", length = 2)
    @Convert(converter = EsitoGiocataConverter.class)
    private enumeratori.EsitoGiocata esito;

}
