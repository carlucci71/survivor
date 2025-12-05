package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sport")
@Data
public class Sport {
    @Id
    @Column(name = "id", length = 20)
    private String id;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @OneToMany(mappedBy = "sport", cascade = CascadeType.ALL)
    @JsonManagedReference("sport-campionati")
    private List<Campionato> campionati = new ArrayList<>();
}
