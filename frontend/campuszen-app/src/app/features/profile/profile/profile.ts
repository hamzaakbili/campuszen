import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { UpdateUserProfileRequest, UserProfileService } from '../../../core/services/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  userId: number | null = null;
  email = '';
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  profile: UpdateUserProfileRequest = {
    firstName: '',
    lastName: '',
    cursus: '',
    bio: '',
    avatarColor: '#667eea'
  };

  constructor(
    private authService: AuthService,
    private profileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      this.errorMessage = 'Utilisateur non connecté';
      this.isLoading = false;
      return;
    }

    this.profileService.getProfile(this.userId).subscribe({
      next: (response) => {
        this.email = response.email;
        this.profile = {
          firstName: response.firstName ?? '',
          lastName: response.lastName ?? '',
          cursus: response.cursus ?? '',
          bio: response.bio ?? '',
          avatarColor: response.avatarColor ?? '#667eea'
        };
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger votre profil';
        this.isLoading = false;
      }
    });
  }

  onSave(): void {
    if (!this.userId) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    this.profileService.updateProfile(this.userId, this.profile).subscribe({
      next: (response) => {
        this.authService.updateCurrentUser({
          firstName: response.firstName,
          lastName: response.lastName,
          avatarColor: response.avatarColor
        });
        this.successMessage = 'Profil mis à jour avec succès';
        this.isSaving = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la mise à jour du profil';
        this.isSaving = false;
      }
    });
  }
}
