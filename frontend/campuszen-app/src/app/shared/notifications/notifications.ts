import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from './notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  unseenCount = 0;
  isOpen = false;

  constructor(public notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.unseenCount = this.notificationService.getUnseenCount();
    });
  }

  togglePanel() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen && this.unseenCount > 0) {
      setTimeout(() => {
        this.notificationService.markAllAsSeen().subscribe(() => {
          this.unseenCount = 0;
        });
      }, 1200);
    }
  }

  isNotificationSeen(id: number): boolean {
    return this.notificationService.isNotificationSeen(id);
  }

  getIcon(type: string): string {
    if (type === 'TASK') {
      return '✅';
    }
    if (type === 'EXPENSE') {
      return '💰';
    }
    if (type === 'SHOPPING') {
      return '🛒';
    }
    if (type === 'EVENT') {
      return '📅';
    }
    return '🔔';
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  }
}
