package com.campuszen.backend.repository;

import com.campuszen.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByResidenceIdOrderByCreatedAtDesc(Long residenceId);
}