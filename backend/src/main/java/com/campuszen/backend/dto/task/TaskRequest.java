package com.campuszen.backend.dto.task;

import com.campuszen.backend.model.Task;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private Task.Frequency frequency;
    private Long assignedToId;
    private LocalDate dueDate;
}