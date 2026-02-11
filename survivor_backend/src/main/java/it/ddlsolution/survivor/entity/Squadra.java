package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
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
@Table(name = "squadra")
@Data
public class Squadra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sigla", length = 200)
    private String sigla;

    @Column(name = "nome", nullable = false, length = 200)
    private String nome;

    @Column(name = "nazione", nullable = false, length = 100)
    private String nazione;

    @Column(name = "id_campionato", nullable = false, length = 20, insertable = false, updatable = false)
    private String idCampionato;

    @ManyToOne
    @JoinColumn(name = "id_campionato", nullable = false)
    @JsonBackReference("campionato-squadre")
    @ToString.Exclude
    private Campionato campionato;

}
