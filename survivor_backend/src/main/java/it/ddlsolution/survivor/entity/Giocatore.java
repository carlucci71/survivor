package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import it.ddlsolution.survivor.converter.StatoGiocatoreConverter;
import it.ddlsolution.survivor.util.Enumeratori;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "giocatore")
@Data
public class Giocatore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "stato", nullable = false, length = 1)
    @Convert(converter = StatoGiocatoreConverter.class)
    private Enumeratori.StatoGiocatore stato;

    @ManyToMany(mappedBy = "giocatori")
    @JsonBackReference("lega-giocatori")
    @ToString.Exclude
    private List<Lega> leghe = new ArrayList<>();

    @OneToMany(mappedBy = "giocatore", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("giocatore-giocate")
    private List<Giocata> giocate = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
