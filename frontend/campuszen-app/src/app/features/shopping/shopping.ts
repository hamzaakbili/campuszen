import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ShoppingItem {
  id: number;
  title: string;
  quantity: number;
  purchased: boolean;
  addedByName: string;
  createdAt: string;
}

export interface ShoppingItemRequest {
  title: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shopping-items`;

  getAllItems(residenceId: number): Observable<ShoppingItem[]> {
    return this.http.get<ShoppingItem[]>(`${this.apiUrl}?residenceId=${residenceId}`);
  }

  createItem(item: ShoppingItemRequest, residenceId: number, userId: number): Observable<ShoppingItem> {
    return this.http.post<ShoppingItem>(
      `${this.apiUrl}?residenceId=${residenceId}&userId=${userId}`,
      item
    );
  }

  togglePurchased(itemId: number, residenceId: number): Observable<ShoppingItem> {
    return this.http.patch<ShoppingItem>(
      `${this.apiUrl}/${itemId}/toggle?residenceId=${residenceId}`,
      {}
    );
  }

  deleteItem(itemId: number, residenceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${itemId}?residenceId=${residenceId}`);
  }
}
