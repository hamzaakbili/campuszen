package com.campuszen.backend.controller;

import com.campuszen.backend.dto.task.TaskRequest;
import com.campuszen.backend.dto.task.TaskResponse;
import com.campuszen.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@CrossOrigin(origins = {
  "http://localhost:4200",
  "https://campuszen-app.vercel.app"
})
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(@RequestParam Long residenceId) {
        return ResponseEntity.ok(taskService.getAllTasksByResidence(residenceId));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @RequestBody TaskRequest request,
            @RequestParam Long residenceId,
            @RequestParam Long userId) {
        return ResponseEntity.ok(taskService.createTask(request, residenceId, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest request,
            @RequestParam Long residenceId) {
        return ResponseEntity.ok(taskService.updateTask(id, request, residenceId));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskResponse> markAsCompleted(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.markAsCompleted(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
