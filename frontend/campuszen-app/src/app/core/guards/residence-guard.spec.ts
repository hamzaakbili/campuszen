import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { residenceGuard } from './residence-guard';

describe('residenceGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => residenceGuard());

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
