import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TooltipModule, OverlayPanelModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { SintesiRichiestaComponent } from './sintesi-richiesta/sintesi-richiesta.component';
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';
import { FriendlyDatePipe } from "app/shared/pipes/friendly-date.pipe";
import { FriendlyHourPipe } from "app/shared/pipes/friendly-hour.pipe";
import { TruncatePipe } from "app/shared/pipes/truncate.pipe";

@NgModule({
  declarations: [
    AppComponent,
    SintesiRichiestaComponent,
    ListaRichiesteComponent,
    FriendlyDatePipe,
    FriendlyHourPipe,
    TruncatePipe,
  ],
  imports: [
    BrowserModule,
    TooltipModule,
    OverlayPanelModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
