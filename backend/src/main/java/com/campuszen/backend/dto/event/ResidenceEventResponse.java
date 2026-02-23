package com.campuszen.backend.dto.event;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ResidenceEventResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime eventDateTime;
    private String createdByName;
    private LocalDateTime createdAt;
}
