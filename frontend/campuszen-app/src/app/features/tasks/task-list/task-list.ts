import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../task';
import { RouterModule } from '@angular/router';
import { ResidenceService } from '../../residence/residence';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = false;
  residenceId: number | null = null;

  constructor(
    private taskService: TaskService,
    private residenceService: ResidenceService
  ) {}

  ngOnInit() {
    const residence = this.residenceService.getCurrentResidence();
    if (residence) {
      this.residenceId = residence.id;
      this.loadTasks();
    }
  }

  loadTasks() {
    if (!this.residenceId) return;
    
    this.isLoading = true;
    this.taskService.getAllTasks(this.residenceId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tâches', error);
        this.isLoading = false;
      }
    });
  }

  markAsCompleted(taskId: number) {
    this.taskService.markAsCompleted(taskId).subscribe({
      next: () => {
        this.loadTasks();
      }
    });
  }

  deleteTask(taskId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
        }
      });
    }
  }
}