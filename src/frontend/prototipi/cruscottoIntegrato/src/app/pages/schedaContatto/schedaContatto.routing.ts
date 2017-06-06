import { Routes, RouterModule } from '@angular/router';

import { schedaContattoComponent } from './schedaContatto.component';

const routes: Routes = [
  {
    path: '',
    component:schedaContattoComponent
  }
];

export const routing = RouterModule.forChild(routes);