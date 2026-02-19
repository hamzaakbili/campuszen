import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('Connexion réussie !', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = 'Email ou mot de passe incorrect';
          this.isLoading = false;
        }
      });
  }
}