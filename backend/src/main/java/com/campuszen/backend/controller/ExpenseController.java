package com.campuszen.backend.controller;

import com.campuszen.backend.dto.expense.ExpenseRequest;
import com.campuszen.backend.dto.expense.ExpenseResponse;
import com.campuszen.backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@CrossOrigin(origins = {
  "http://localhost:4200",
  "https://campuszen-app.vercel.app"
})
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses(@RequestParam Long residenceId) {
        return ResponseEntity.ok(expenseService.getAllExpensesByResidence(residenceId));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @RequestBody ExpenseRequest request,
            @RequestParam Long residenceId,
            @RequestParam Long userId) {
        return ResponseEntity.ok(expenseService.createExpense(request, residenceId, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
