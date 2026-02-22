import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { TaskListComponent } from './features/tasks/task-list/task-list';
import { TaskCreateComponent } from './features/tasks/task-create/task-create';
import { ExpenseListComponent } from './features/expenses/expense-list/expense-list';
import { ExpenseCreateComponent } from './features/expenses/expense-create/expense-create';
import { ResidenceSetupComponent } from './features/residence/residence-setup/residence-setup';
import { authGuard } from './core/guards/auth-guard';
import { residenceGuard } from './core/guards/residence-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'residence-setup', 
    component: ResidenceSetupComponent,
    canActivate: [authGuard]  // Doit être connecté
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard, residenceGuard]  // Doit être connecté ET avoir une résidence
  },
  { 
    path: 'tasks', 
    component: TaskListComponent,
    canActivate: [authGuard, residenceGuard]
  },
  { 
    path: 'tasks/create', 
    component: TaskCreateComponent,
    canActivate: [authGuard, residenceGuard]
  },
  { 
    path: 'expenses', 
    component: ExpenseListComponent,
    canActivate: [authGuard, residenceGuard]
  },
  { 
    path: 'expenses/create', 
    component: ExpenseCreateComponent,
    canActivate: [authGuard, residenceGuard]
  }
];