package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import it.ddlsolution.survivor.converter.StatoLegaConverter;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lega")
@Data
public class Lega {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "edizione", nullable = false)
    private Integer edizione;

    @Column(name = "giornata_iniziale", nullable = false)
    private int giornataIniziale;

    @Column(name = "giornata_calcolata")
    private Integer giornataCalcolata;

    @ManyToOne
    @JoinColumn(name = "id_campionato", nullable = false)
    @JsonBackReference("campionato-leghe")
    @ToString.Exclude
    private Campionato campionato;

    @OneToMany(mappedBy = "lega", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<GiocatoreLega> giocatoreLeghe = new ArrayList<>();

    @OneToMany(mappedBy = "lega", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("lega-giocate")
    private List<Giocata> giocate = new ArrayList<>();

    @Column(name = "pwd", length = 50)
    private String pwd;

    @Column(name = "stato", nullable = false, length = 1)
    @Convert(converter = StatoLegaConverter.class)
    private Enumeratori.StatoLega stato;


}
