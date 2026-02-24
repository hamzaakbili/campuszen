package com.campuszen.backend.controller;

import com.campuszen.backend.dto.residence.CreateResidenceRequest;
import com.campuszen.backend.dto.residence.JoinResidenceRequest;
import com.campuszen.backend.dto.residence.ResidenceResponse;
import com.campuszen.backend.service.ResidenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/residences")
@CrossOrigin(origins = {
  "http://localhost:4200",
  "https://campuszen-app.vercel.app"
})
public class ResidenceController {

    @Autowired
    private ResidenceService residenceService;

    @PostMapping("/create")
    public ResponseEntity<ResidenceResponse> createResidence(
            @RequestBody CreateResidenceRequest request,
            @RequestParam Long userId) {
        return ResponseEntity.ok(residenceService.createResidence(request, userId));
    }

    @PostMapping("/join")
    public ResponseEntity<ResidenceResponse> joinResidence(
            @RequestBody JoinResidenceRequest request,
            @RequestParam Long userId) {
        return ResponseEntity.ok(residenceService.joinResidence(request, userId));
    }

    @GetMapping("/my-residence")
    public ResponseEntity<ResidenceResponse> getMyResidence(@RequestParam Long userId) {
        ResidenceResponse response = residenceService.getUserResidence(userId);
        if (response == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }
}
