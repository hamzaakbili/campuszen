package com.campuszen.backend.service;

import com.campuszen.backend.dto.expense.ExpenseRequest;
import com.campuszen.backend.dto.expense.ExpenseResponse;
import com.campuszen.backend.model.Expense;
import com.campuszen.backend.model.Residence;
import com.campuszen.backend.model.User;
import com.campuszen.backend.repository.ExpenseRepository;
import com.campuszen.backend.repository.ResidenceRepository;
import com.campuszen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResidenceRepository residenceRepository;

    public List<ExpenseResponse> getAllExpensesByResidence(Long residenceId) {
        return expenseRepository.findAll().stream()
                .filter(expense -> expense.getResidence() != null &&
                        expense.getResidence().getId().equals(residenceId))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ExpenseResponse createExpense(ExpenseRequest request, Long residenceId) {
        Expense expense = new Expense();
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());

        // Qui a payé
        User paidBy = userRepository.findById(request.getPaidById())
                .orElseThrow(() -> new RuntimeException("User not found"));
        expense.setPaidBy(paidBy);

        // Partager entre qui
        Set<User> splitBetween = new HashSet<>();
        for (Long userId : request.getSplitBetweenIds()) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            splitBetween.add(user);
        }
        expense.setSplitBetween(splitBetween);

        // Associer la résidence
        Residence residence = residenceRepository.findById(residenceId)
                .orElseThrow(() -> new RuntimeException("Residence not found"));
        expense.setResidence(residence);

        Expense savedExpense = expenseRepository.save(expense);
        return convertToResponse(savedExpense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    private ExpenseResponse convertToResponse(Expense expense) {
        String paidByName = expense.getPaidBy().getFirstName() + " " + expense.getPaidBy().getLastName();

        Set<Long> splitBetweenIds = expense.getSplitBetween().stream()
                .map(User::getId)
                .collect(Collectors.toSet());

        Set<String> splitBetweenNames = expense.getSplitBetween().stream()
                .map(u -> u.getFirstName() + " " + u.getLastName())
                .collect(Collectors.toSet());

        // Calcul du montant par personne
        BigDecimal amountPerPerson = expense.getAmount()
                .divide(BigDecimal.valueOf(expense.getSplitBetween().size()), 2, RoundingMode.HALF_UP);

        return new ExpenseResponse(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getPaidBy().getId(),
                paidByName,
                splitBetweenIds,
                splitBetweenNames,
                expense.getDate(),
                amountPerPerson
        );
    }
}