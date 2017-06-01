import { NgModule } from '@angular/core';

import { rigaElencoRichiesteDiAssistenzaComponent } from './rigaElencoRichiesteDiAssistenza/rigaElencoRichiesteDiAssistenza.component';
import { FormschedacontattoComponent } from './schedaContatto/formschedaContatto/formschedaContatto.component'

@NgModule({
  imports: [
  ],
  
  declarations: [
      rigaElencoRichiesteDiAssistenzaComponent
      ,FormschedacontattoComponent
  ],
  
  exports: [
    rigaElencoRichiesteDiAssistenzaComponent
    ,FormschedacontattoComponent
  ]
})

export class SharedModule {
}
