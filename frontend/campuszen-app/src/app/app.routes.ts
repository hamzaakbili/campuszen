import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { TaskListComponent } from './features/tasks/task-list/task-list';
import { TaskCreateComponent } from './features/tasks/task-create/task-create'; 

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/create', component: TaskCreateComponent }, 
  { path: 'dashboard', redirectTo: '/tasks', pathMatch: 'full' }
];