import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ResidenceService } from '../../features/residence/residence';

export interface Notification {
  id: number;
  type: 'TASK' | 'EXPENSE';
  message: string;
  createdByName: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private residenceService = inject(ResidenceService);
  private apiUrl = `${environment.apiUrl}/notifications`;
  
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  
  private seenNotificationIds: Set<number> = new Set();

  constructor() {
    this.loadSeenIds();
    this.startPolling();
  }

  private startPolling() {
    // Rafraîchir toutes les 10 secondes
    interval(10000).pipe(
      switchMap(() => this.fetchNotifications())
    ).subscribe(notifications => {
      this.notificationsSubject.next(notifications);  
    });
  
    // Premier chargement immédiat
    this.fetchNotifications().subscribe(notifications => {
      this.notificationsSubject.next(notifications);  
    });
  }

  private fetchNotifications() {
    const residence = this.residenceService.getCurrentResidence();
    if (!residence) {
      return this.http.get<Notification[]>(`${this.apiUrl}?residenceId=0`);  
    }
  
    return this.http.get<Notification[]>(`${this.apiUrl}?residenceId=${residence.id}`);
  }

  private loadSeenIds() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    const key = `seenNotifications_${userId}`;  // ← Clé unique par utilisateur
    const saved = localStorage.getItem(key);
    if (saved) {
      this.seenNotificationIds = new Set(JSON.parse(saved));
    }
  }

  private saveSeenIds() {
    const userId = localStorage.getItem('userId');
    console.log('Sauvegarde des IDs vus pour userId:', userId);  // Debug
    if (!userId) {
      console.error('Pas de userId pour sauvegarder les notifications vues');
      return;
    }
    
    const key = `seenNotifications_${userId}`;
    const ids = Array.from(this.seenNotificationIds);
    console.log('IDs à sauvegarder:', ids);  // Debug
    localStorage.setItem(key, JSON.stringify(ids));
  }

  markAllAsSeen() {
    const notifications = this.notificationsSubject.value;
    notifications.forEach(n => this.seenNotificationIds.add(n.id));
    this.saveSeenIds();
    console.log('Notifications marquées comme vues:', Array.from(this.seenNotificationIds));  // Debug
  }

  getUnseenCount(): number {
    return this.notificationsSubject.value.filter(n => !this.seenNotificationIds.has(n.id)).length;
  }

  isNotificationSeen(id: number): boolean {
    return this.seenNotificationIds.has(id);
  }
}