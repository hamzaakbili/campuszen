import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidenceSetup } from './residence-setup';

describe('ResidenceSetup', () => {
  let component: ResidenceSetup;
  let fixture: ComponentFixture<ResidenceSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidenceSetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidenceSetup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
