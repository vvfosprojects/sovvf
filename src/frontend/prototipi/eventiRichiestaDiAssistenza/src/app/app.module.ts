import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { FriendlyDatePipe } from "./shared/pipes/friendly-date.pipe";
import { FriendlyHourPipe } from "./shared/pipes/friendly-hour.pipe";
import { DistanzaTemporalePipe } from "./shared/pipes/distanza-temporale.pipe";

import { AppComponent } from './app.component';
import { EventoRichiestaComponent } from './evento-richiesta/evento-richiesta.component';
import { ListaEventiRichiestaComponent } from './lista-eventi-richiesta/lista-eventi-richiesta.component';
import { EventiRichiestaService } from './eventi-richiesta-service/eventi-richiesta.service';
import { EventiRichiestaServiceFake } from './eventi-richiesta-service/eventi-richiesta.service.fake';

@NgModule({
  declarations: [
    AppComponent,
    EventoRichiestaComponent,
    ListaEventiRichiestaComponent,
    FriendlyDatePipe,
    FriendlyHourPipe,
    DistanzaTemporalePipe  
  ],
  imports: [
    NgbModule.forRoot(),
    HttpModule,
    BrowserModule
  ],
  providers: [{ provide: EventiRichiestaService, useClass:EventiRichiestaServiceFake}],
  bootstrap: [AppComponent]
})
export class AppModule { }
