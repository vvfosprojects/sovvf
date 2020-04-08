import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { FormChiamataComponent } from './form-chiamata/form-chiamata.component';

import { AgmCoreModule } from "@agm/core";
import {AutoCompleteModule, GrowlModule, TooltipModule, ChipsModule} from 'primeng/primeng';

import { RicercaTipologieService } from "./ricerca-tipologie/ricerca-tipologie.service";
import { RicercaService } from "app/ricerca/ricerca.service";
import { DataBaseService } from "app/db/data-base.service";

@NgModule({
  declarations: [
    AppComponent,
    FormChiamataComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCUyaLim6v4CB_eo-oJmeDlvPCQxwHha70",
      libraries: ["places"]
    }),
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    GrowlModule,
    TooltipModule,
    ChipsModule 
  ],
  providers: [RicercaService, RicercaTipologieService, DataBaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
