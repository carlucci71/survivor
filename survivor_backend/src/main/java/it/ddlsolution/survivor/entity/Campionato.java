package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
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
import org.hibernate.annotations.Where;

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

    // Aggiungi un campo transient per le squadre filtrate
    @Transient
    @JsonProperty("squadre")
    private List<Squadra> squadre = new ArrayList<>();

    @Column(name = "nazione", nullable = false, length = 100)
    private String nazione;

    @Column(name = "anno_corrente", nullable = false)
    private short annoCorrente;

}
