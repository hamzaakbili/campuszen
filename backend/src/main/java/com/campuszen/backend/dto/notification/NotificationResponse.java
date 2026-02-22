package com.campuszen.backend.dto.notification;

import com.campuszen.backend.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String type;
    private String message;
    private String createdByName;
    private LocalDateTime createdAt;
}