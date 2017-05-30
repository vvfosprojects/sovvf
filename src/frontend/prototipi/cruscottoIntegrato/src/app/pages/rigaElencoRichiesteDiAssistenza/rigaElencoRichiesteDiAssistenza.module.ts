import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';

import { routing } from './rigaElencoRichiesteDiAssistenza.routing';
import { rigaElencoRichiesteDiAssistenzaComponent } from './rigaElencoRichiesteDiAssistenza.component';
//import { PagesModule } from '../pages.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing//,
    //PagesModule    
  ],
  declarations: [
    rigaElencoRichiesteDiAssistenzaComponent
  ]
})
export class rigaElencoRichiesteDiAssistenzaModule {}