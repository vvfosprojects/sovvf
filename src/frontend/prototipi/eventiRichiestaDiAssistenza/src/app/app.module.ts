import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { EventoRichiestaComponent } from './evento-richiesta/evento-richiesta.component';
import { ListaEventiRichiestaComponent } from './lista-eventi-richiesta/lista-eventi-richiesta.component';

@NgModule({
  declarations: [
    AppComponent,
    EventoRichiestaComponent,
    ListaEventiRichiestaComponent
  ],
  imports: [
    NgbModule.forRoot(), BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
