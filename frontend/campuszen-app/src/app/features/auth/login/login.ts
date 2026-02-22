import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ResidenceService } from '../../residence/residence';  // Rajoute cet import

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
    private residenceService: ResidenceService,  // Rajoute cette ligne
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('Connexion réussie !', response);
          
          // Récupérer la résidence de l'utilisateur depuis le backend
          // Utilise l'ID de l'utilisateur (pour l'instant on utilise 1, à améliorer plus tard)
          this.residenceService.getMyResidence(1).subscribe({
            next: (residence) => {
              // Résidence trouvée, aller au dashboard
              this.router.navigate(['/dashboard']);
            },
            error: () => {
              // Pas de résidence, aller au setup
              this.router.navigate(['/residence-setup']);
            }
          });
        },
        error: (error) => {
          this.errorMessage = 'Email ou mot de passe incorrect';
          this.isLoading = false;
        }
      });
  }
}