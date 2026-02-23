package com.campuszen.backend.dto.event;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResidenceEventRequest {
    private String title;
    private String description;
    private String location;
    private LocalDateTime eventDateTime;
}
