import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCreateComponent } from './task-create';

describe('TaskCreate', () => {
  let component: TaskCreateComponent;
  let fixture: ComponentFixture<TaskCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
