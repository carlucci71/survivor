package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.Enumeratori;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String email;
//    private String name;
//    private boolean enabled = true;
//    private Enumeratori.Role role;
//    private LocalDateTime createdAt;
//    private LocalDateTime lastLoginAt;
}

