import { Routes, RouterModule } from '@angular/router';

import { rigaElencoRichiesteDiAssistenzaComponent } from './rigaElencoRichiesteDiAssistenza.component';

const routes: Routes = [
  {
    path: '',
    component:rigaElencoRichiesteDiAssistenzaComponent
  }
];

export const routing = RouterModule.forChild(routes);