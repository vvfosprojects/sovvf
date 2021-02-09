import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { TreeviewModule } from 'ngx-treeview';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImpostazioniSedeComponent } from './impostazioni-sede.component';
import { DettagliTipologieComponent } from './dettagli-tipologie/dettagli-tipologie.component';
import { DettaglioTipologiaModalComponent } from './dettagli-tipologie/add-dettaglio-tipologia-modal/dettaglio-tipologia-modal.component';
import { ImpostazioniSedeRoutingModule } from './impostazioni-sede.routing';
import { NgxsModule } from '@ngxs/store';
import { RicercaDettagliTipologieComponent } from './dettagli-tipologie/ricerca-dettagli-tipologie/ricerca-dettagli-tipologie.component';
import { DettaglioTipologiaModalState } from './store/states/dettaglio-tipologia-modal-state';
import { TriageComponent } from './triage/triage.component';

@NgModule({
    declarations: [
        ImpostazioniSedeComponent,
        DettagliTipologieComponent,
        DettaglioTipologiaModalComponent,
        RicercaDettagliTipologieComponent,
        TriageComponent
    ],
    imports: [
        CommonModule,
        ImpostazioniSedeRoutingModule,
        TreeviewModule.forRoot(),
        SharedModule.forRoot(),
        NgxsModule.forFeature([
            DettaglioTipologiaModalState
        ]),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        NgxPaginationModule,
        SharedModule,
        NgbModule,
        ReactiveFormsModule
    ]
})

export class ImpostazioniSedeModule {
}
