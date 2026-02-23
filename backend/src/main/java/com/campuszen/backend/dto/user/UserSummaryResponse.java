package com.campuszen.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserSummaryResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}
