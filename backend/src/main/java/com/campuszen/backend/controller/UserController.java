package com.campuszen.backend.controller;

import com.campuszen.backend.dto.user.UpdateUserProfileRequest;
import com.campuszen.backend.dto.user.UserProfileResponse;
import com.campuszen.backend.dto.user.UserSummaryResponse;
import com.campuszen.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = {
  "http://localhost:4200",
  "https://campuszen-app.vercel.app"
})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/test")
    public String test() {
        return "✅ API CampusZen fonctionne !";
    }

    @GetMapping
    public ResponseEntity<List<UserSummaryResponse>> getUsersByResidence(@RequestParam Long residenceId) {
        return ResponseEntity.ok(userService.getUsersByResidence(residenceId));
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserProfileResponse> updateUserProfile(
            @PathVariable Long userId,
            @RequestBody UpdateUserProfileRequest request) {
        return ResponseEntity.ok(userService.updateUserProfile(userId, request));
    }
}
