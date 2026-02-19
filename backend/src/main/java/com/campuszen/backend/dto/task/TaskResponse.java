package com.campuszen.backend.dto.task;

import com.campuszen.backend.model.Task;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Task.Frequency frequency;
    private Long assignedToId;
    private String assignedToName;
    private LocalDate dueDate;
    private Task.Status status;
}