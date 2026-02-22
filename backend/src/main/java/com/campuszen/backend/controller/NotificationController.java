package com.campuszen.backend.controller;

import com.campuszen.backend.dto.notification.NotificationResponse;
import com.campuszen.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin(origins = "http://localhost:4200")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(@RequestParam Long residenceId) {
        return ResponseEntity.ok(notificationService.getNotificationsByResidence(residenceId));
    }
}