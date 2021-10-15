import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeviewModule } from 'ngx-treeview';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImpostazioniSedeComponent } from './impostazioni-sede.component';
import { DettagliTipologieComponent } from './dettagli-tipologie/dettagli-tipologie.component';
import { DettaglioTipologiaModalComponent } from './dettagli-tipologie/dettaglio-tipologia-modal/dettaglio-tipologia-modal.component';
import { ImpostazioniSedeRoutingModule } from './impostazioni-sede.routing';
import { NgxsModule } from '@ngxs/store';
import { RicercaDettagliTipologieComponent } from './dettagli-tipologie/ricerca-dettagli-tipologie/ricerca-dettagli-tipologie.component';
import { DettaglioTipologiaModalState } from './store/states/dettaglio-tipologia-modal-state';
import { TriageComponent } from './triage/triage.component';
import { MapsModule } from '../maps/maps.module';

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
        NgbModule,
        SharedModule,
        TreeviewModule.forRoot(),
        NgxsModule.forFeature([
            DettaglioTipologiaModalState
        ]),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        MapsModule
    ]
})

export class ImpostazioniSedeModule {
}
