package com.campuszen.backend.dto.shopping;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ShoppingItemResponse {
    private Long id;
    private String title;
    private Integer quantity;
    private boolean purchased;
    private String addedByName;
    private LocalDateTime createdAt;
}
