import { TestBed } from '@angular/core/testing';

import { Residence } from './residence';

describe('Residence', () => {
  let service: Residence;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Residence);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
