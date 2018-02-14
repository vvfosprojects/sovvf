import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaSchedeRoutingModule } from './lista-schede-routing.module';
//import { ListaSchedeModule } from './lista-schede.module';
import { ListaSchedeComponent } from './lista-schede.component';
import { SintesiSchedaModule } from "../sintesi-scheda/sintesi-scheda.module";
import { SintesiSchedaComponent } from "../sintesi-scheda/sintesi-scheda.component";

import { SharedPipesModule } from "../../shared/pipes/shared-pipes.module";
import { FormsModule } from '@angular/forms';

//import { InfoAggregateModule } from '../../shared';

@NgModule({
    imports: [CommonModule, ListaSchedeRoutingModule, SintesiSchedaModule, SharedPipesModule, FormsModule],
    declarations: [ListaSchedeComponent, SintesiSchedaComponent]
})
export class ListaSchedeModule {}