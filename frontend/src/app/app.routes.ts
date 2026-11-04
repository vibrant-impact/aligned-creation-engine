import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WorkshopComponent } from './components/workshop/workshop.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingPageComponent,
    title: 'Aligned Creation Engine | Downward Current of Manifestation'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard | Aligned Creation Engine'
  },
  {
    path: 'workshop/:id',
    component: WorkshopComponent,
    title: 'Studio Workshop | Aligned Creation Engine'
  },
  {
    path: '**',
    redirectTo: ''
  }
];