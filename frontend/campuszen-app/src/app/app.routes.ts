import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { TaskListComponent } from './features/tasks/task-list/task-list';
import { TaskCreateComponent } from './features/tasks/task-create/task-create'; 
import { ExpenseListComponent } from './features/expenses/expense-list/expense-list';
import { ExpenseCreateComponent } from './features/expenses/expense-create/expense-create';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/create', component: TaskCreateComponent }, 
  { path: 'expenses', component: ExpenseListComponent },
  { path: 'expenses/create', component: ExpenseCreateComponent },
  { path: 'dashboard', redirectTo: '/tasks', pathMatch: 'full' }
];