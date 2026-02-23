package com.campuszen.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String cursus;
    private String bio;
    private String avatarColor;
    private Long residenceId;
}
