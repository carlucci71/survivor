package it.ddlsolution.survivor.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.envers.RevisionEntity;
import org.hibernate.envers.RevisionNumber;
import org.hibernate.envers.RevisionTimestamp;

@Entity
@Table(name = "revinfo")
@RevisionEntity(RevInfoListener.class)
@Data
public class RevInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @RevisionNumber
    @Column(name = "rev")
    private Long id;

    @RevisionTimestamp
    @Column(name = "revtstmp")
    private Long timestamp;

    @Column(name = "username", length = 255)
    private String username;

    @Column(name = "user_id")
    private Long userId;

    // Keep legacy accessors for compatibility if anyone used old names
    public Long getRev() {
        return this.id;
    }

    public void setRev(Long rev) {
        this.id = rev;
    }

    public Long getRevtstmp() {
        return this.timestamp;
    }

    public void setRevtstmp(Long revtstmp) {
        this.timestamp = revtstmp;
    }
}
