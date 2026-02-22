import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ResidenceService } from '../../residence/residence';  


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';
  cursus = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private residenceService: ResidenceService, 
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;

    this.authService.register({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      cursus: this.cursus
    }).subscribe({
      next: (response) => {
        console.log('Inscription réussie !', response);
        this.router.navigate(['/residence-setup']);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'inscription. Vérifiez vos informations.';
        this.isLoading = false;
      }
    });
  }
}