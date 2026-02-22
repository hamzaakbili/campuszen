import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TaskService, TaskRequest } from '../task';
import { ResidenceService } from '../../residence/residence';
import { NotificationService } from '../../../shared/notifications/notification.service';
import { AuthService } from '../../../core/services/auth'; 

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-create.html',
  styleUrl: './task-create.css'
})
export class TaskCreateComponent {
  task: TaskRequest = {
    title: '',
    description: '',
    frequency: 'DAILY',
    dueDate: ''
  };
  
  errorMessage = '';
  isLoading = false;
  residenceId: number | null = null;
  userId: number | null = null;

  constructor(
    private taskService: TaskService,
    private residenceService: ResidenceService,
    //private notificationService: NotificationService, 
    private authService: AuthService, 
    private router: Router
  ) {
    const residence = this.residenceService.getCurrentResidence();
    if (residence) {
      this.residenceId = residence.id;
    }
    this.userId = this.authService.getUserId(); 
    console.log('UserId récupéré:', this.userId);  // ← Ajoute cette ligne
    console.log('ResidenceId récupéré:', this.residenceId); 
  }

  onSubmit() {
    if (!this.residenceId || !this.userId) {
      this.errorMessage = 'Pas de résidence associée';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.taskService.createTask(this.task, this.residenceId, this.userId).subscribe({
      next: () => {
        //this.notificationService.addNotification('task', `Nouvelle tâche créée : ${this.task.title}`);  // ← Ajoute cette ligne
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la création de la tâche';
        this.isLoading = false;
      }
    });
  }
}