package com.campuszen.backend.service;

import com.campuszen.backend.dto.user.UpdateUserProfileRequest;
import com.campuszen.backend.dto.user.UserProfileResponse;
import com.campuszen.backend.dto.user.UserSummaryResponse;
import com.campuszen.backend.model.User;
import com.campuszen.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class UserService {

    private static final Pattern HEX_COLOR_PATTERN = Pattern.compile("^#[0-9a-fA-F]{6}$");

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserSummaryResponse> getUsersByResidence(Long residenceId) {
        return userRepository.findByResidenceIdOrderByFirstNameAscLastNameAsc(residenceId).stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toProfileResponse(user);
    }

    public UserProfileResponse updateUserProfile(Long userId, UpdateUserProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName().trim());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName().trim());
        }
        if (request.getCursus() != null) {
            user.setCursus(request.getCursus().trim());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }
        if (request.getAvatarColor() != null && HEX_COLOR_PATTERN.matcher(request.getAvatarColor()).matches()) {
            user.setAvatarColor(request.getAvatarColor());
        }

        User savedUser = userRepository.save(user);
        return toProfileResponse(savedUser);
    }

    private UserSummaryResponse toSummaryResponse(User user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );
    }

    private UserProfileResponse toProfileResponse(User user) {
        Long residenceId = user.getResidence() != null ? user.getResidence().getId() : null;
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getCursus(),
                user.getBio(),
                user.getAvatarColor(),
                residenceId
        );
    }
}
