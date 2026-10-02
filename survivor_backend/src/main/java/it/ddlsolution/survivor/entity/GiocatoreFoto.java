package it.ddlsolution.survivor.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

/**
 * Foto profilo di un giocatore (JPEG 256x256 gia' normalizzato dal backend). Tabella separata da
 * giocatore apposta: il file non deve mai finire caricato insieme al Giocatore. Niente @Data: equals/hashCode
 * su un byte[] sarebbero inutili e costosi.
 */
@Entity
@Table(name = "giocatore_foto")
@Getter
@Setter
public class GiocatoreFoto {

    @Id
    @Column(name = "giocatore_id")
    private Long giocatoreId;

    /** null quando un admin ha rimosso la foto (la riga resta solo per ricordare il blocco). */
    @JdbcTypeCode(SqlTypes.VARBINARY)
    @Column(name = "data")
    private byte[] data;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    /** Nascosta in automatico dopo troppe segnalazioni, in attesa della decisione di un admin. */
    @Column(name = "nascosta", nullable = false)
    private boolean nascosta;

    /** Un admin ha rimosso la foto e vietato nuovi caricamenti. */
    @Column(name = "bloccata", nullable = false)
    private boolean bloccata;
}
