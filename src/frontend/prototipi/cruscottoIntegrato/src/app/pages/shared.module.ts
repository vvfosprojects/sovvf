import { NgModule } from '@angular/core';

//import { GoogleMaps } from './maps/components/googleMaps/googleMaps.component';
import { rigaElencoRichiesteDiAssistenzaComponent } from './rigaElencoRichiesteDiAssistenza/rigaElencoRichiesteDiAssistenza.component';

@NgModule({
  imports: [
  ],
  
  declarations: [
      //GoogleMaps,
      rigaElencoRichiesteDiAssistenzaComponent
  ],
  
  exports: [
    //GoogleMaps,
    rigaElencoRichiesteDiAssistenzaComponent
  ]
})

export class SharedModule {
}
