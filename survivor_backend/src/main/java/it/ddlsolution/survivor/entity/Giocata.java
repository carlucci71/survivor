package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import it.ddlsolution.survivor.converter.EsitoGiocataConverter;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

@Entity
@Table(name = "giocata")
@Data
@Audited
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
    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    private Giocatore giocatore;

    @ManyToOne
    @JoinColumn(name = "id_lega", nullable = false)
    @JsonBackReference("lega-giocate")
    @ToString.Exclude
    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    private Lega lega;

    @ManyToOne
    @JoinColumn(name = "id_squadra")
    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    private Squadra squadra;

    @Column(name = "esito", length = 2)
    @Convert(converter = EsitoGiocataConverter.class)
    private Enumeratori.EsitoGiocata esito;

    @Column(name = "forzatura", length = 1000)
    private String forzatura;

    @Column(name = "pubblica")
    private Boolean pubblica; // Se true, la giocata è visibile a tutti; se false/null, è nascosta fino all'inizio della giornata


}
