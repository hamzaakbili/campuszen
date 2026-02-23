package com.campuszen.backend.dto.user;

import lombok.Data;

@Data
public class UpdateUserProfileRequest {
    private String firstName;
    private String lastName;
    private String cursus;
    private String bio;
    private String avatarColor;
}
