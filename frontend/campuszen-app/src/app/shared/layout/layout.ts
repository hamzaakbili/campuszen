import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { ResidenceService } from '../../features/residence/residence';
import { NotificationsComponent } from '../notifications/notifications';  // ← Ajoute cette ligne


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationsComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent implements OnInit {
  userName = '';
  residenceName = '';
  residenceCode = '';

  constructor(
    private authService: AuthService,
    private residenceService: ResidenceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.firstName;
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