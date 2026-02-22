package com.campuszen.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "residences")
@Data
public class Residence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;

    @Column(unique = true, nullable = false)
    private String code;  // Code unique pour rejoindre (ex: RES-12345)

    @OneToMany(mappedBy = "residence")
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "residence")
    private List<Task> tasks = new ArrayList<>();

    @OneToMany(mappedBy = "residence")
    private List<Expense> expenses = new ArrayList<>();
}