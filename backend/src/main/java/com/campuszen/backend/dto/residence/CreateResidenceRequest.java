package com.campuszen.backend.dto.residence;

import lombok.Data;

@Data
public class CreateResidenceRequest {
    private String name;
    private String address;
}