import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService, Expense } from '../expense';
import { RouterModule } from '@angular/router';
import { ResidenceService } from '../../residence/residence';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css'
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  isLoading = false;
  residenceId: number | null = null;

  constructor(
    private expenseService: ExpenseService,
    private residenceService: ResidenceService
  ) {}

  ngOnInit() {
    const residence = this.residenceService.getCurrentResidence();
    if (residence) {
      this.residenceId = residence.id;
      this.loadExpenses();
    }
  }

  loadExpenses() {
    if (!this.residenceId) return;
    
    this.isLoading = true;
    this.expenseService.getAllExpenses(this.residenceId).subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des dépenses', error);
        this.isLoading = false;
      }
    });
  }

  deleteExpense(expenseId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      this.expenseService.deleteExpense(expenseId).subscribe({
        next: () => {
          this.loadExpenses();
        }
      });
    }
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }
}