package it.ddlsolution.survivor.entity;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean enabled = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Enumeratori.Role role = Enumeratori.Role.STANDARD;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime lastLoginAt;

    /** Lingua preferita (it | en | es), usata per tradurre le notifiche push lato backend. */
    @Column(nullable = false, length = 2)
    private String lingua = "it";

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (role == null) {
            role = Enumeratori.Role.STANDARD;
        }
    }
}



