import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { InterventiService } from "./interventi/interventi.service";
import { ItemInterventoComponent } from './item-intervento/item-intervento.component';
import { ListaInterventiComponent } from './lista-interventi/lista-interventi.component';
import { CartografiaInterventiComponent } from './cartografia-interventi/cartografia-interventi.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemInterventoComponent,
    ListaInterventiComponent,
    CartografiaInterventiComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [InterventiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
