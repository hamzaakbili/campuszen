package com.campuszen.backend.service;

import com.campuszen.backend.dto.task.TaskRequest;
import com.campuszen.backend.dto.task.TaskResponse;
import com.campuszen.backend.model.Residence;
import com.campuszen.backend.model.Task;
import com.campuszen.backend.model.User;
import com.campuszen.backend.repository.ResidenceRepository;
import com.campuszen.backend.repository.TaskRepository;
import com.campuszen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResidenceRepository residenceRepository;

    public List<TaskResponse> getAllTasksByResidence(Long residenceId) {
        return taskRepository.findAll().stream()
                .filter(task -> task.getResidence() != null &&
                        task.getResidence().getId().equals(residenceId))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse createTask(TaskRequest request, Long residenceId) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setFrequency(request.getFrequency());
        task.setDueDate(request.getDueDate());
        task.setStatus(Task.Status.PENDING);

        if (request.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedTo(assignedUser);
        }

        Residence residence = residenceRepository.findById(residenceId)
                .orElseThrow(() -> new RuntimeException("Residence not found"));
        task.setResidence(residence);

        Task savedTask = taskRepository.save(task);
        return convertToResponse(savedTask);
    }

    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setFrequency(request.getFrequency());
        task.setDueDate(request.getDueDate());

        if (request.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedTo(assignedUser);
        }

        Task updatedTask = taskRepository.save(task);
        return convertToResponse(updatedTask);
    }

    public TaskResponse markAsCompleted(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(Task.Status.COMPLETED);
        Task updatedTask = taskRepository.save(task);
        return convertToResponse(updatedTask);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    private TaskResponse convertToResponse(Task task) {
        String assignedToName = task.getAssignedTo() != null
                ? task.getAssignedTo().getFirstName() + " " + task.getAssignedTo().getLastName()
                : null;

        Long assignedToId = task.getAssignedTo() != null
                ? task.getAssignedTo().getId()
                : null;

        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getFrequency(),
                assignedToId,
                assignedToName,
                task.getDueDate(),
                task.getStatus()
        );
    }
}