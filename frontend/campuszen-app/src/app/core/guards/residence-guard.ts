import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ResidenceService } from '../../features/residence/residence';

export const residenceGuard = () => {
  const residenceService = inject(ResidenceService);
  const router = inject(Router);

  if (residenceService.hasResidence()) {
    return true;
  }

  router.navigate(['/residence-setup']);
  return false;
};