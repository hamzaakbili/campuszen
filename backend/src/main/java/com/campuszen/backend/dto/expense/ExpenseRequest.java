package com.campuszen.backend.dto.expense;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
public class ExpenseRequest {
    private String description;
    private BigDecimal amount;
    private Long paidById;
    private Set<Long> splitBetweenIds;
    private LocalDate date;
}