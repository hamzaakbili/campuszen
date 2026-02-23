package com.campuszen.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "shopping_items")
@Data
public class ShoppingItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "residence_id", nullable = false)
    private Residence residence;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(nullable = false)
    private boolean purchased = false;

    @ManyToOne
    @JoinColumn(name = "added_by_id")
    private User addedBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
