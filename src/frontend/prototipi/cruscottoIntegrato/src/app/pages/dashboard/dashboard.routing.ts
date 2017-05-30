import { Routes, RouterModule }  from '@angular/router';

import { Dashboard } from './dashboard.component';
import { ModuleWithProviders } from '@angular/core';

///INIZIO
import { Maps } from '../maps/maps.component';
import { GoogleMaps } from '../maps/components/googleMaps/googleMaps.component';
///FINE

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      //{ path: 'treeview', component: TreeViewComponent }

      { path: 'googlemaps', component: GoogleMaps }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
