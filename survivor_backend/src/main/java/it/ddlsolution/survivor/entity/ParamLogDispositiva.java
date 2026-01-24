package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name = "param_log_dispositiva")
@Data
public class ParamLogDispositiva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", length = 3)
    private String id;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "valore", nullable = false, length = 4000)
    private String valore;

    @Column(name = "className", nullable = false, length = 1000)
    private String className;

    @ManyToOne
    @JoinColumn(name = "id_log_dispositiva", nullable = false)
    @JsonBackReference("logDispositiva-paramLogDispositive")
    @ToString.Exclude
    private LogDispositiva logDispositiva;


}
