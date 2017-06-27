import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SintesiRichiestaComponent } from './sintesi-richiesta/sintesi-richiesta.component';
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';
import { FriendlyDatePipe } from "app/shared/pipes/friendly-date.pipe";
import { FriendlyHourPipe } from "app/shared/pipes/friendly-hour.pipe";

@NgModule({
  declarations: [
    AppComponent,
    SintesiRichiestaComponent,
    ListaRichiesteComponent,
    FriendlyDatePipe,
    FriendlyHourPipe,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
