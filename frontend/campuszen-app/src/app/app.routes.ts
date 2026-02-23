import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { ResidenceSetupComponent } from './features/residence/residence-setup/residence-setup';
import { LayoutComponent } from './shared/layout/layout';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { TaskListComponent } from './features/tasks/task-list/task-list';
import { TaskCreateComponent } from './features/tasks/task-create/task-create';
import { ExpenseListComponent } from './features/expenses/expense-list/expense-list';
import { ExpenseCreateComponent } from './features/expenses/expense-create/expense-create';
import { ShoppingListComponent } from './features/shopping/shopping-list/shopping-list';
import { EventsListComponent } from './features/events/events-list/events-list';
import { ProfileComponent } from './features/profile/profile/profile';
import { authGuard } from './core/guards/auth-guard';
import { residenceGuard } from './core/guards/residence-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'residence-setup', 
    component: ResidenceSetupComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tasks', component: TaskListComponent, canActivate: [residenceGuard] },
      { path: 'tasks/create', component: TaskCreateComponent, canActivate: [residenceGuard] },
      { path: 'expenses', component: ExpenseListComponent, canActivate: [residenceGuard] },
      { path: 'expenses/create', component: ExpenseCreateComponent, canActivate: [residenceGuard] },
      { path: 'shopping', component: ShoppingListComponent, canActivate: [residenceGuard] },
      { path: 'events', component: EventsListComponent, canActivate: [residenceGuard] },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
