import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TaskService, TaskRequest } from '../task';
import { ResidenceService } from '../../residence/residence';

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

  constructor(
    private taskService: TaskService,
    private residenceService: ResidenceService,
    private router: Router
  ) {
    const residence = this.residenceService.getCurrentResidence();
    if (residence) {
      this.residenceId = residence.id;
    }
  }

  onSubmit() {
    if (!this.residenceId) {
      this.errorMessage = 'Pas de résidence associée';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.taskService.createTask(this.task, this.residenceId).subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la création de la tâche';
        this.isLoading = false;
      }
    });
  }
}