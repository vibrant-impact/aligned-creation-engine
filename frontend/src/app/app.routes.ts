import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WorkshopComponent } from './components/workshop/workshop.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'workshop/:id', component: WorkshopComponent },
  { path: '**', redirectTo: 'dashboard' }
];