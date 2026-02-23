package com.campuszen.backend.repository;

import com.campuszen.backend.model.ResidenceEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResidenceEventRepository extends JpaRepository<ResidenceEvent, Long> {
    List<ResidenceEvent> findByResidenceIdOrderByEventDateTimeAsc(Long residenceId);
}
