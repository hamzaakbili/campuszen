import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Expense {
  id?: number;
  description: string;
  amount: number;
  paidById: number;
  paidByName?: string;
  splitBetweenIds: number[];
  splitBetweenNames?: string[];
  date: string;
  amountPerPerson?: number;
}

export interface ExpenseRequest {
  description: string;
  amount: number;
  paidById: number;
  splitBetweenIds: number[];
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/expenses`;

  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  createExpense(expense: ExpenseRequest): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}