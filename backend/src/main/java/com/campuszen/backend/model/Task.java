package com.campuszen.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private Frequency frequency;

    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @ManyToOne
    @JoinColumn(name = "residence_id")
    private User residence;  // On utilisera User pour l'instant, on créera Residence plus tard

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Frequency {
        DAILY, WEEKLY, MONTHLY
    }

    public enum Status {
        PENDING, COMPLETED
    }
}