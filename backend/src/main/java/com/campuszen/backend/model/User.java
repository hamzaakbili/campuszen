package com.campuszen.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "residence_id")
    private Residence residence;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String firstName;
    private String lastName;
    private String cursus;
    private String bio;
    private String avatarColor = "#667eea";

    @Enumerated(EnumType.STRING)
    private Role role = Role.STUDENT;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        STUDENT, RESIDENCE_MANAGER
    }
}
