import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
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
  taskCount = 0;
  expenseTotal = 0;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit() {
    // Récupérer le nom de l'utilisateur
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.firstName;
      }
    });

    // Charger les stats
    this.loadStats();
  }

  loadStats() {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.taskCount = tasks.filter(t => t.status === 'PENDING').length;
      }
    });

    this.expenseService.getAllExpenses().subscribe({
      next: (expenses) => {
        this.expenseTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}