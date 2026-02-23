import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ResidenceService } from '../../features/residence/residence';

export const residenceGuard: CanActivateFn = () => {
  const residenceService = inject(ResidenceService);
  const router = inject(Router);

  if (residenceService.hasResidence()) {
    return true;
  }

  return router.createUrlTree(['/residence-setup']);
};
