import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { UserProfileService } from '../../core/services/profile';
import { ResidenceService } from '../../features/residence/residence';
import { NotificationsComponent } from '../notifications/notifications';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationsComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent implements OnInit {
  userName = '';
  userInitial = 'U';
  avatarColor = '#667eea';
  residenceName = '';
  residenceCode = '';
  private loadedProfileUserId: number | null = null;

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private residenceService: ResidenceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.firstName;
        this.userInitial = (user.firstName?.charAt(0) || 'U').toUpperCase();
        this.avatarColor = user.avatarColor || '#667eea';

        if (this.loadedProfileUserId !== user.userId) {
          this.loadedProfileUserId = user.userId;
          this.userProfileService.getProfile(user.userId).subscribe({
            next: (profile) => {
              this.userName = profile.firstName || this.userName;
              this.userInitial = (profile.firstName?.charAt(0) || this.userInitial).toUpperCase();
              this.avatarColor = profile.avatarColor || this.avatarColor;
            },
            error: () => {
              this.loadedProfileUserId = null;
            }
          });
        }
      } else {
        this.userName = '';
        this.userInitial = 'U';
        this.avatarColor = '#667eea';
        this.loadedProfileUserId = null;
      }
    });

    const residence = this.residenceService.getCurrentResidence();
    if (residence) {
      this.residenceName = residence.name;
      this.residenceCode = residence.code;
    }
  }

  logout() {
    this.authService.logout();
    this.residenceService.clearResidence();
    this.router.navigate(['/login']);
  }
}
