import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { TreeviewModule } from 'ngx-treeview';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImpostazioniSedeComponent } from './impostazioni-sede.component';
import { DettagliTipologieComponent } from './dettagli-tipologie/dettagli-tipologie.component';
import { AddDettaglioTipologiaModalComponent } from './dettagli-tipologie/add-dettaglio-tipologia-modal/add-dettaglio-tipologia-modal.component';
import { ImpostazioniSedeRoutingModule } from './impostazioni-sede.routing';

@NgModule({
    declarations: [
        ImpostazioniSedeComponent,
        DettagliTipologieComponent,
        AddDettaglioTipologiaModalComponent
    ],
    exports: [
        DettagliTipologieComponent
    ],
    imports: [
        CommonModule,
        ImpostazioniSedeRoutingModule,
        TreeviewModule.forRoot(),
        SharedModule.forRoot(),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        NgxPaginationModule,
        NgbModule
    ]
})

export class ImpostazioniSedeModule {
}
