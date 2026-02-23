import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, of, Subscription, timer } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ResidenceService } from '../../features/residence/residence';
import { AuthService } from '../../core/services/auth';

export interface Notification {
  id: number;
  type: 'TASK' | 'EXPENSE' | 'SHOPPING' | 'EVENT';
  message: string;
  createdByName: string;
  createdAt: Date;
  seen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private residenceService = inject(ResidenceService);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/notifications`;
  
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private pollSubscription: Subscription | null = null;
  private activeContext: { residenceId: number; userId: number } | null = null;

  constructor() {
    this.bindPollingToSession();
  }

  private bindPollingToSession() {
    combineLatest([
      this.authService.currentUser$,
      this.residenceService.currentResidence$
    ]).subscribe(([user, residence]) => {
      if (!user || !residence) {
        this.activeContext = null;
        this.notificationsSubject.next([]);
        this.stopPolling();
        return;
      }

      const nextContext = { residenceId: residence.id, userId: user.userId };
      const sameContext =
        this.activeContext?.residenceId === nextContext.residenceId &&
        this.activeContext?.userId === nextContext.userId;

      if (sameContext && this.pollSubscription) {
        return;
      }

      this.activeContext = nextContext;
      this.startPolling(nextContext);
    });
  }

  private startPolling(context: { residenceId: number; userId: number }) {
    this.stopPolling();

    this.pollSubscription = timer(0, 10000).pipe(
      switchMap(() => this.fetchNotifications(context.residenceId, context.userId))
    ).subscribe(notifications => {
      this.notificationsSubject.next(notifications);
    });
  }

  private stopPolling() {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
      this.pollSubscription = null;
    }
  }

  private fetchNotifications(residenceId: number, userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.apiUrl}?residenceId=${residenceId}&userId=${userId}`
    ).pipe(
      catchError(() => of([]))
    );
  }

  markAllAsSeen(): Observable<void> {
    if (!this.activeContext) {
      return of(void 0);
    }

    return this.http.patch<void>(
      `${this.apiUrl}/seen?residenceId=${this.activeContext.residenceId}&userId=${this.activeContext.userId}`,
      {}
    ).pipe(
      tap(() => {
        const updated = this.notificationsSubject.value.map(notification => ({
          ...notification,
          seen: true
        }));
        this.notificationsSubject.next(updated);
      })
    );
  }

  getUnseenCount(): number {
    return this.notificationsSubject.value.filter(notification => !notification.seen).length;
  }

  isNotificationSeen(id: number): boolean {
    const notification = this.notificationsSubject.value.find(item => item.id === id);
    return notification?.seen ?? true;
  }
}
