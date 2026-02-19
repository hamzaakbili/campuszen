import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExpenseService, ExpenseRequest } from '../expense';

@Component({
  selector: 'app-expense-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './expense-create.html',
  styleUrl: './expense-create.css'
})
export class ExpenseCreateComponent {
  expense: ExpenseRequest = {
    description: '',
    amount: 0,
    paidById: 1, // On mettra l'utilisateur connecté plus tard
    splitBetweenIds: [1], // Pour l'instant juste soi-même
    date: new Date().toISOString().split('T')[0]
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private expenseService: ExpenseService,
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    this.expenseService.createExpense(this.expense).subscribe({
      next: () => {
        this.router.navigate(['/expenses']);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la création de la dépense';
        this.isLoading = false;
      }
    });
  }
}