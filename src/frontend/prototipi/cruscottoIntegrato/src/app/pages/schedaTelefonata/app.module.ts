import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { FormChiamataComponent } from './form-chiamata/form-chiamata.component';
import { MultiselectDropdownModule  } from 'angular-2-dropdown-multiselect';

import { AgmCoreModule } from "@agm/core";
import {AutoCompleteModule, GrowlModule, TooltipModule, ChipsModule} from 'primeng/primeng';

import { RicercaTipologieService } from "./ricerca-tipologie/ricerca-tipologie.service";
import { RicercaService } from "./ricerca/ricerca.service";

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
    MultiselectDropdownModule,
    AutoCompleteModule,
    GrowlModule,
    TooltipModule,
    ChipsModule
  ],
  providers: [RicercaService, RicercaTipologieService],
  bootstrap: [AppComponent]
})
export class AppModule1 { }
