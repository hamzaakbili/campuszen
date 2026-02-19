package com.campuszen.backend.dto.expense;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private String description;
    private BigDecimal amount;
    private Long paidById;
    private String paidByName;
    private Set<Long> splitBetweenIds;
    private Set<String> splitBetweenNames;
    private LocalDate date;
    private BigDecimal amountPerPerson;
}