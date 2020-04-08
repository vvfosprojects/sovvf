import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';

import { SintesiSchedaRoutingModule } from './sintesi-scheda-routing.module';
import { SintesiSchedaComponent } from './sintesi-scheda.component';
import { SharedPipesModule } from "../../shared/pipes/shared-pipes.module";

//import { InfoAggregateModule } from '../../shared';

import { ListaSchedeService } from "../lista-schede/lista-schede.service";
import { ListaSchedeService_FakeJson } from "../lista-schede/lista-schede-fake-json.service";


@NgModule({
    imports: [CommonModule, SintesiSchedaRoutingModule, SharedPipesModule, HttpClientModule, HttpModule],
  //  declarations: [SintesiSchedaComponent],
   /* providers: [
        { provide: ListaSchedeService, useClass: ListaSchedeService_FakeJson },
        HttpClientModule
      ]
      */
    providers: [ListaSchedeService_FakeJson, HttpClientModule ]
      
})
export class SintesiSchedaModule {}
