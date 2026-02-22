package com.campuszen.backend.service;

import com.campuszen.backend.dto.notification.NotificationResponse;
import com.campuszen.backend.model.Notification;
import com.campuszen.backend.model.Residence;
import com.campuszen.backend.model.User;
import com.campuszen.backend.repository.NotificationRepository;
import com.campuszen.backend.repository.ResidenceRepository;
import com.campuszen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

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

    public List<NotificationResponse> getNotificationsByResidence(Long residenceId) {
        return notificationRepository.findByResidenceIdOrderByCreatedAtDesc(residenceId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private NotificationResponse convertToResponse(Notification notification) {
        String createdByName = notification.getCreatedBy().getFirstName() + " " + notification.getCreatedBy().getLastName();
        return new NotificationResponse(
                notification.getId(),
                notification.getType().name(),
                notification.getMessage(),
                createdByName,
                notification.getCreatedAt()
        );
    }
}