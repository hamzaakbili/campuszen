package com.campuszen.backend.controller;

import com.campuszen.backend.dto.event.ResidenceEventRequest;
import com.campuszen.backend.dto.event.ResidenceEventResponse;
import com.campuszen.backend.service.ResidenceEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@CrossOrigin(origins = {
  "http://localhost:4200",
  "https://campuszen-app.vercel.app"
})
public class ResidenceEventController {

    private final ResidenceEventService residenceEventService;

    public ResidenceEventController(ResidenceEventService residenceEventService) {
        this.residenceEventService = residenceEventService;
    }

    @GetMapping
    public ResponseEntity<List<ResidenceEventResponse>> getEvents(@RequestParam Long residenceId) {
        return ResponseEntity.ok(residenceEventService.getEventsByResidence(residenceId));
    }

    @PostMapping
    public ResponseEntity<ResidenceEventResponse> createEvent(
            @RequestBody ResidenceEventRequest request,
            @RequestParam Long residenceId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(residenceEventService.createEvent(request, residenceId, userId));
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<ResidenceEventResponse> updateEvent(
            @PathVariable Long eventId,
            @RequestBody ResidenceEventRequest request,
            @RequestParam Long residenceId
    ) {
        return ResponseEntity.ok(residenceEventService.updateEvent(eventId, request, residenceId));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long eventId,
            @RequestParam Long residenceId
    ) {
        residenceEventService.deleteEvent(eventId, residenceId);
        return ResponseEntity.noContent().build();
    }
}
