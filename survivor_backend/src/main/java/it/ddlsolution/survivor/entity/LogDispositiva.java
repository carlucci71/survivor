package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import it.ddlsolution.survivor.dto.ParamLogDispositivaDTO;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "log_dispositiva")
@Data
public class LogDispositiva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", length = 3)
    private Long id;

    @Column(name = "tipologia", nullable = false, length = 100)
    private String tipologia;

    @Column(name = "esito", nullable = false, length = 100)
    private String esito;

    @Column(name = "messaggio", length = 1000)
    private String messaggio;

    @OneToMany(mappedBy = "logDispositiva", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("logDispositiva-paramLogDispositive")
    private List<ParamLogDispositiva> paramLogDispositive = new ArrayList<>();

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "id_errore")
    private Integer idErrore;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
