import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ResidenceService } from '../../residence/residence';
import { TaskService } from '../../tasks/task';
import { ExpenseService } from '../../expenses/expense';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  userName = '';
  residenceName = '';
  residenceCode = '';
  taskCount = 0;
  expenseTotal = 0;
  residenceId: number | null = null;

  constructor(
    private authService: AuthService,
    private residenceService: ResidenceService,
    private taskService: TaskService,
    private expenseService: ExpenseService,
    private router: Router
  ) {}

  ngOnInit() {
    // Récupérer le nom de l'utilisateur
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.firstName;
      }
    });

    // Récupérer la résidence
    const residence = this.residenceService.getCurrentResidence();
    if (residence) {
      this.residenceId = residence.id;
      this.residenceName = residence.name;
      this.residenceCode = residence.code;
      this.loadStats();
    }
  }

  loadStats() {
    if (!this.residenceId) return;

    this.taskService.getAllTasks(this.residenceId).subscribe({
      next: (tasks) => {
        this.taskCount = tasks.filter(t => t.status === 'PENDING').length;
      }
    });

    this.expenseService.getAllExpenses(this.residenceId).subscribe({
      next: (expenses) => {
        this.expenseTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.residenceService.clearResidence();
    this.router.navigate(['/login']);
  }

  copyCode() {
    navigator.clipboard.writeText(this.residenceCode);
    alert('Code copié ! Partagez-le avec vos colocataires 🎉');
  }
}