package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "campionato")
@Data
public class Campionato {
    @Id
    @Column(name = "id", length = 20)
    private String id;

    @ManyToOne
    @JoinColumn(name = "id_sport", nullable = false)
    @JsonBackReference("sport-campionati")
    @ToString.Exclude
    private Sport sport;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "num_giornate", nullable = false, length = 100)
    private int numGiornate;

    @OneToMany(mappedBy = "campionato", cascade = CascadeType.ALL)
    @JsonManagedReference("campionato-leghe")
    private List<Lega> leghe = new ArrayList<>();

    @OneToMany(mappedBy = "campionato", cascade = CascadeType.ALL)
    @JsonManagedReference("campionato-squadre")
    private List<Squadra> squadre = new ArrayList<>();

}
