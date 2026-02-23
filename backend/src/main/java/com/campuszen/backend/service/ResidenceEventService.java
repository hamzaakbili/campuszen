package com.campuszen.backend.service;

import com.campuszen.backend.dto.event.ResidenceEventRequest;
import com.campuszen.backend.dto.event.ResidenceEventResponse;
import com.campuszen.backend.model.Residence;
import com.campuszen.backend.model.ResidenceEvent;
import com.campuszen.backend.model.User;
import com.campuszen.backend.repository.ResidenceEventRepository;
import com.campuszen.backend.repository.ResidenceRepository;
import com.campuszen.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResidenceEventService {

    private final ResidenceEventRepository residenceEventRepository;
    private final ResidenceRepository residenceRepository;
    private final UserRepository userRepository;

    public ResidenceEventService(
            ResidenceEventRepository residenceEventRepository,
            ResidenceRepository residenceRepository,
            UserRepository userRepository
    ) {
        this.residenceEventRepository = residenceEventRepository;
        this.residenceRepository = residenceRepository;
        this.userRepository = userRepository;
    }

    public List<ResidenceEventResponse> getEventsByResidence(Long residenceId) {
        return residenceEventRepository.findByResidenceIdOrderByEventDateTimeAsc(residenceId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ResidenceEventResponse createEvent(ResidenceEventRequest request, Long residenceId, Long userId) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new RuntimeException("Event title is required");
        }
        if (request.getEventDateTime() == null) {
            throw new RuntimeException("Event date is required");
        }

        User user = validateUserResidence(userId, residenceId);
        Residence residence = residenceRepository.findById(residenceId)
                .orElseThrow(() -> new RuntimeException("Residence not found"));

        ResidenceEvent residenceEvent = new ResidenceEvent();
        residenceEvent.setResidence(residence);
        residenceEvent.setCreatedBy(user);
        residenceEvent.setTitle(request.getTitle().trim());
        residenceEvent.setDescription(request.getDescription());
        residenceEvent.setLocation(request.getLocation());
        residenceEvent.setEventDateTime(request.getEventDateTime());

        ResidenceEvent savedEvent = residenceEventRepository.save(residenceEvent);
        return toResponse(savedEvent);
    }

    public ResidenceEventResponse updateEvent(Long eventId, ResidenceEventRequest request, Long residenceId) {
        ResidenceEvent event = residenceEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getResidence() == null || !event.getResidence().getId().equals(residenceId)) {
            throw new RuntimeException("Event does not belong to this residence");
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            event.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }
        if (request.getLocation() != null) {
            event.setLocation(request.getLocation());
        }
        if (request.getEventDateTime() != null) {
            event.setEventDateTime(request.getEventDateTime());
        }

        ResidenceEvent updatedEvent = residenceEventRepository.save(event);
        return toResponse(updatedEvent);
    }

    public void deleteEvent(Long eventId, Long residenceId) {
        ResidenceEvent event = residenceEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getResidence() == null || !event.getResidence().getId().equals(residenceId)) {
            throw new RuntimeException("Event does not belong to this residence");
        }

        residenceEventRepository.delete(event);
    }

    private User validateUserResidence(Long userId, Long residenceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResidence() == null || !user.getResidence().getId().equals(residenceId)) {
            throw new RuntimeException("User does not belong to this residence");
        }

        return user;
    }

    private ResidenceEventResponse toResponse(ResidenceEvent event) {
        String createdByName = event.getCreatedBy() != null
                ? event.getCreatedBy().getFirstName() + " " + event.getCreatedBy().getLastName()
                : "Inconnu";

        return new ResidenceEventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getLocation(),
                event.getEventDateTime(),
                createdByName.trim(),
                event.getCreatedAt()
        );
    }
}
