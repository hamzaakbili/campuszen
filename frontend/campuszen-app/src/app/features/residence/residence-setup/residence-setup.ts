import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResidenceService, CreateResidenceRequest, JoinResidenceRequest } from '../residence';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-residence-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './residence-setup.html',
  styleUrl: './residence-setup.css'
})
export class ResidenceSetupComponent {
  mode: 'create' | 'join' | null = null;
  
  createData: CreateResidenceRequest = {
    name: '',
    address: ''
  };
  
  joinData: JoinResidenceRequest = {
    code: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private residenceService: ResidenceService,
    private authService: AuthService,
    private router: Router
  ) {}

  selectMode(mode: 'create' | 'join') {
    this.mode = mode;
    this.errorMessage = '';
  }

  createResidence() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Utilisateur non connecté';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.residenceService.createResidence(this.createData, userId).subscribe({
      next: (residence) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la création de la résidence';
        this.isLoading = false;
      }
    });
  }

  joinResidence() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Utilisateur non connecté';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.residenceService.joinResidence(this.joinData, userId).subscribe({
      next: (residence) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Code de résidence invalide';
        this.isLoading = false;
      }
    });
  }

  skipSetup() {
    this.router.navigate(['/dashboard']);
  }
}