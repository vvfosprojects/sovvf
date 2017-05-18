import { Routes, RouterModule } from '@angular/router';

import { NewComponent } from './new.component';

const routes: Routes = [
  {
    path: '',
    component: NewComponent
  }
];

export const routing = RouterModule.forChild(routes);