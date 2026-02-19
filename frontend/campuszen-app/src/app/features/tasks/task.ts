import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Task {
  id?: number;
  title: string;
  description: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  assignedToId?: number;
  assignedToName?: string;
  dueDate: string;
  status: 'PENDING' | 'COMPLETED';
}

export interface TaskRequest {
  title: string;
  description: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  assignedToId?: number;
  dueDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tasks`;

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: TaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  markAsCompleted(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/complete`, {});
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}