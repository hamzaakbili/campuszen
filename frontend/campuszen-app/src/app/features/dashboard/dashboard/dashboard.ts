import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ResidenceService } from '../../residence/residence';
import { TaskService } from '../../tasks/task';
import { ExpenseService } from '../../expenses/expense';
import { ShoppingService } from '../../shopping/shopping';
import { EventService } from '../../events/event';

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
  shoppingPendingCount = 0;
  upcomingEventCount = 0;
  nextEventLabel = 'Aucun événement';
  residenceId: number | null = null;

  constructor(
    private authService: AuthService,
    private residenceService: ResidenceService,
    private taskService: TaskService,
    private expenseService: ExpenseService,
    private shoppingService: ShoppingService,
    private eventService: EventService
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

    this.shoppingService.getAllItems(this.residenceId).subscribe({
      next: (items) => {
        this.shoppingPendingCount = items.filter((item) => !item.purchased).length;
      }
    });

    this.eventService.getAllEvents(this.residenceId).subscribe({
      next: (events) => {
        const now = new Date().getTime();
        const upcomingEvents = events.filter((event) => new Date(event.eventDateTime).getTime() >= now);

        this.upcomingEventCount = upcomingEvents.length;
        if (upcomingEvents.length > 0) {
          this.nextEventLabel = this.formatEventDate(upcomingEvents[0].eventDateTime);
        } else {
          this.nextEventLabel = 'Aucun événement';
        }
      }
    });
  }

  copyCode() {
    navigator.clipboard.writeText(this.residenceCode);
    alert('Code copié ! Partagez-le avec vos colocataires 🎉');
  }

  private formatEventDate(eventDateTime: string): string {
    return new Date(eventDateTime).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
