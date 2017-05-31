import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders }  from '@angular/core';

import { Dashboard }            from './dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: []
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
