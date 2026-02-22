package com.campuszen.backend.repository;

import com.campuszen.backend.model.Residence;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ResidenceRepository extends JpaRepository<Residence, Long> {
    Optional<Residence> findByCode(String code);
    boolean existsByCode(String code);
}