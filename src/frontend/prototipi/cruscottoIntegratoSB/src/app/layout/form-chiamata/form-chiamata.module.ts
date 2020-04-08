import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormChiamataRoutingModule } from './form-chiamata-routing.module';
import { FormChiamataComponent } from './form-chiamata.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AgmCoreModule } from "@agm/core";
import {AutoCompleteModule, GrowlModule, TooltipModule, ChipsModule, SplitButtonModule, DialogModule} from 'primeng/primeng';

import { RicercaTipologieService } from "./ricerca-tipologie/ricerca-tipologie.service";
import { RicercaService } from "./ricerca/ricerca.service";
import { DataBaseService } from "./db/data-base.service";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyCUyaLim6v4CB_eo-oJmeDlvPCQxwHha70",
            libraries: ["places"]
          }),
          FormsModule,
          HttpModule,
          ReactiveFormsModule,
        CommonModule, 
        FormChiamataRoutingModule,
        NgbDropdownModule,
        AutoCompleteModule,
        GrowlModule,
        SplitButtonModule,
        TooltipModule,
        DialogModule,
        ChipsModule ],
    declarations: [FormChiamataComponent],
    providers: [RicercaService, RicercaTipologieService, DataBaseService]
})
export class FormChiamataModule {}
