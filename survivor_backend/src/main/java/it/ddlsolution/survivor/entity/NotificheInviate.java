package it.ddlsolution.survivor.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import it.ddlsolution.survivor.converter.StatoLegaConverter;
import it.ddlsolution.survivor.converter.TipoNotificaConverter;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "notifiche_inviate")
@Data
public class NotificheInviate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_campionato", nullable = false)
    @JsonBackReference("campionato-notifiche")
    @ToString.Exclude
    private Campionato campionato;

    @Column(name = "anno", nullable = false)
    private short anno = 2025;

    @Column(name = "giornata", nullable = false)
    private int giornata;

    @Column(name = "tipo_notifica", length = 50)
    @Convert(converter = TipoNotificaConverter.class)
    private Enumeratori.TipoNotifica tipoNotifica;

}

