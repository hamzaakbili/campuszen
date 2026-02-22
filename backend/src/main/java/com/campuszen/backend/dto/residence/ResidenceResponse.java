package com.campuszen.backend.dto.residence;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResidenceResponse {
    private Long id;
    private String name;
    private String address;
    private String code;
    private int memberCount;
}