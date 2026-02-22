import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExpenseService, ExpenseRequest } from '../expense';
import { ResidenceService } from '../../residence/residence';
import { AuthService } from '../../../core/services/auth';

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
    paidById: 1,
    splitBetweenIds: [1],
    date: new Date().toISOString().split('T')[0]
  };
  
  errorMessage = '';
  isLoading = false;
  residenceId: number | null = null;
  userId: number | null = null; 

  constructor(
    private expenseService: ExpenseService,
    private residenceService: ResidenceService,
    private authService: AuthService, 
    private router: Router
  ) {
    const residence = this.residenceService.getCurrentResidence();
    if (residence) {
      this.residenceId = residence.id;
    }
    this.userId = this.authService.getUserId(); 
  }

  onSubmit() {
    if (!this.residenceId || !this.userId) {
      this.errorMessage = 'Pas de résidence associée';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.expenseService.createExpense(this.expense, this.residenceId, this.userId).subscribe({
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