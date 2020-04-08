import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';

import { SchedaContattoRoutingModule } from './scheda-contatto-routing.module';
import { SchedaContattoComponent } from './scheda-contatto.component';
import { SharedPipesModule } from "../../shared/pipes/shared-pipes.module";

import { InfoAggregateModule } from '../../shared';

import { ListaSchedeService } from "../lista-schede/lista-schede.service";
import { ListaSchedeService_FakeJson } from "../lista-schede/lista-schede-fake-json.service";


@NgModule({
    imports: [CommonModule, SchedaContattoRoutingModule, InfoAggregateModule, SharedPipesModule, HttpClientModule, HttpModule],
    declarations: [SchedaContattoComponent],
   /* providers: [
        { provide: ListaSchedeService, useClass: ListaSchedeService_FakeJson },
        HttpClientModule
      ]
      */
    providers: [ListaSchedeService_FakeJson, HttpClientModule ]
      
})
export class SchedaContattoModule {}
