import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routing } from './new.routing';

import { ListaMezziService } from "app/pages/situazioneMezzi/lista-mezzi/lista-mezzi.service";
import { ListaMezziComponent } from "app/pages/situazioneMezzi/lista-mezzi/lista-mezzi.component";
import { FriendlyHourPipe } from "app/pages/situazioneMezzi/shared/pipes/friendly-hour.pipe";
import { FriendlyDatePipe } from "app/pages/situazioneMezzi/shared/pipes/friendly-date.pipe";
import { MezzoinservizioComponent } from "app/pages/situazioneMezzi/mezzoinservizio/mezzoinservizio.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing
  ],
  declarations: [
    AppComponent,
    MezzoinservizioComponent,
    FriendlyDatePipe,
    FriendlyHourPipe,
    ListaMezziComponent
  ],
  providers: [ ListaMezziService ]
})
export class NewModule {}