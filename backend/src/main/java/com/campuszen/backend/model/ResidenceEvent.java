package com.campuszen.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "residence_events")
@Data
public class ResidenceEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "residence_id", nullable = false)
    private Residence residence;

    @Column(nullable = false)
    private String title;

    private String description;

    private String location;

    @Column(nullable = false)
    private LocalDateTime eventDateTime;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
