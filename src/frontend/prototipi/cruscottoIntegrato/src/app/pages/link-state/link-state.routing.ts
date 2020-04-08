import { Routes, RouterModule } from '@angular/router';

import { LinkStateComponent } from './link-state.component';

const routes: Routes = [
  {
    path: '',
    component: LinkStateComponent
  }
];

export const routing = RouterModule.forChild(routes);