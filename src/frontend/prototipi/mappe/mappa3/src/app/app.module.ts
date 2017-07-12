import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GoogleMapComponent } from './googleMap/googleMap.component'

import { PuntiDataOutput } from "./service/puntiDataOutput.service";


@NgModule({
  declarations: [
    AppComponent
   ,GoogleMapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [PuntiDataOutput],
  bootstrap: [AppComponent]
})
export class AppModule { }
