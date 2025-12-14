package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "giornata_iniziale", nullable = false)
    private int giornataIniziale;

    @Column(name = "giornata_calcolata")
    private Integer giornataCalcolata;

    @ManyToOne
    @JoinColumn(name = "id_campionato", nullable = false)
    @JsonBackReference("campionato-leghe")
    @ToString.Exclude
    private Campionato campionato;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "giocatore_lega",
            joinColumns = @JoinColumn(name = "id_lega"),
            inverseJoinColumns = @JoinColumn(name = "id_giocatore")
    )
    @JsonManagedReference("lega-giocatori")
    private List<Giocatore> giocatori = new ArrayList<>();

    @OneToMany(mappedBy = "lega", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("lega-giocate")
    private List<Giocata> giocate = new ArrayList<>();

}
