package com.campuszen.backend.dto.shopping;

import lombok.Data;

@Data
public class ShoppingItemRequest {
    private String title;
    private Integer quantity;
}
