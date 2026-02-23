package com.campuszen.backend.service;

import com.campuszen.backend.dto.notification.NotificationResponse;
import com.campuszen.backend.model.Notification;
import com.campuszen.backend.model.NotificationRead;
import com.campuszen.backend.model.Residence;
import com.campuszen.backend.model.User;
import com.campuszen.backend.repository.NotificationReadRepository;
import com.campuszen.backend.repository.NotificationRepository;
import com.campuszen.backend.repository.ResidenceRepository;
import com.campuszen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationReadRepository notificationReadRepository;

    @Autowired
    private ResidenceRepository residenceRepository;

    @Autowired
    private UserRepository userRepository;

    public void createNotification(Long residenceId, Notification.NotificationType type, String message, Long createdById) {
        Residence residence = residenceRepository.findById(residenceId)
                .orElseThrow(() -> new RuntimeException("Residence not found"));

        User createdBy = userRepository.findById(createdById)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setResidence(residence);
        notification.setType(type);
        notification.setMessage(message);
        notification.setCreatedBy(createdBy);

        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getNotificationsByResidence(Long residenceId, Long userId) {
        validateUserResidence(userId, residenceId);
        Set<Long> seenNotificationIds = notificationReadRepository.findSeenNotificationIdsByUserIdAndResidenceId(userId, residenceId);

        return notificationRepository.findByResidenceIdOrderByCreatedAtDesc(residenceId).stream()
                .map(notification -> convertToResponse(notification, seenNotificationIds.contains(notification.getId())))
                .collect(Collectors.toList());
    }

    public void markAllAsSeen(Long residenceId, Long userId) {
        User user = validateUserResidence(userId, residenceId);
        Set<Long> seenNotificationIds = notificationReadRepository.findSeenNotificationIdsByUserIdAndResidenceId(userId, residenceId);

        List<NotificationRead> newReads = notificationRepository.findByResidenceIdOrderByCreatedAtDesc(residenceId)
                .stream()
                .filter(notification -> !seenNotificationIds.contains(notification.getId()))
                .map(notification -> {
                    NotificationRead notificationRead = new NotificationRead();
                    notificationRead.setNotification(notification);
                    notificationRead.setUser(user);
                    notificationRead.setReadAt(LocalDateTime.now());
                    return notificationRead;
                })
                .collect(Collectors.toList());

        if (!newReads.isEmpty()) {
            notificationReadRepository.saveAll(newReads);
        }
    }

    private User validateUserResidence(Long userId, Long residenceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResidence() == null || !user.getResidence().getId().equals(residenceId)) {
            throw new RuntimeException("User does not belong to this residence");
        }

        return user;
    }

    private NotificationResponse convertToResponse(Notification notification, boolean seen) {
        String createdByName = notification.getCreatedBy() != null
                ? notification.getCreatedBy().getFirstName() + " " + notification.getCreatedBy().getLastName()
                : "Système";
        return new NotificationResponse(
                notification.getId(),
                notification.getType().name(),
                notification.getMessage(),
                createdByName.trim(),
                notification.getCreatedAt(),
                seen
        );
    }
}
