package com.campuszen.backend.repository;

import com.campuszen.backend.model.NotificationRead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface NotificationReadRepository extends JpaRepository<NotificationRead, Long> {
    @Query("""
            select nr.notification.id
            from NotificationRead nr
            where nr.user.id = :userId
              and nr.notification.residence.id = :residenceId
            """)
    Set<Long> findSeenNotificationIdsByUserIdAndResidenceId(
            @Param("userId") Long userId,
            @Param("residenceId") Long residenceId
    );

    boolean existsByNotificationIdAndUserId(Long notificationId, Long userId);
}
