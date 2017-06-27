import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MappaService } from "./google/mappa.service";
import { PuntiMappaGoogleInput, PuntiMappaGoogleOutput } from "./google/mappa.model";
import { MappaComponent } from './google/mappa.component'

@NgModule({
  declarations: [
    AppComponent

    ,MappaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [MappaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
