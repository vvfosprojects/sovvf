import { Routes, RouterModule }  from '@angular/router';

import { Dashboard } from './dashboard.component';
import { ModuleWithProviders } from '@angular/core';

///INIZIO
import { Maps } from '../maps/maps.component';
import { BubbleMaps } from '../maps/components/bubbleMaps/bubbleMaps.component';
import { GoogleMaps } from '../maps/components/googleMaps/googleMaps.component';
import { LeafletMaps } from '../maps/components/leafletMaps/leafletMaps.component';
import { LineMaps } from '../maps/components/lineMaps/lineMaps.component';
///FINE

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      //{ path: 'treeview', component: TreeViewComponent }
///INIZIO      
      { path: 'bubblemaps', component: BubbleMaps },
      { path: 'googlemaps', component: GoogleMaps },
      { path: 'leafletmaps', component: LeafletMaps },
      { path: 'linemaps', component: LineMaps }
///FINE      
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
