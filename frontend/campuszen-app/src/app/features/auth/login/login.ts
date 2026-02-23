import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ResidenceService } from '../../residence/residence';

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
  returnUrl = '/dashboard';

  constructor(
    private authService: AuthService,
    private residenceService: ResidenceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
  }

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;
  
    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          this.residenceService.getMyResidence(response.userId).subscribe({
            next: (residence) => {
              if (residence) {
                this.router.navigateByUrl(this.returnUrl);
              } else {
                this.router.navigate(['/residence-setup']);
              }
            },
            error: () => {
              this.router.navigate(['/residence-setup']);
            }
          });
        },
        error: () => {
          this.errorMessage = 'Email ou mot de passe incorrect';
          this.isLoading = false;
        }
      });
  }
}
