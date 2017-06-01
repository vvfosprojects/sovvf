import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared.module';
import { routing } from './rigaElencoRichiesteDiAssistenza.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    SharedModule        
  ],
  declarations: [
  ]
})
export class rigaElencoRichiesteDiAssistenzaModule {}