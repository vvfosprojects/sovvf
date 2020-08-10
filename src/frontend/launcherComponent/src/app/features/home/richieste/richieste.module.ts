import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
/**
 Modules
 */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SintesiRichiestaModule } from './lista-richieste/sintesi-richiesta/sintesi-richiesta.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
/**
 Components
 */
import { RichiesteComponent } from './richieste.component';
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';
import { SintesiRichiestaSmComponent } from './lista-richieste/sintesi-richiesta-sm/sintesi-richiesta-sm.component';
import { RichiestaFissataComponent } from './richiesta-fissata/richiesta-fissata.component';
import { ModificaRichiestaComponent } from './modifica-richiesta/modifica-richiesta.component';
/**
 Service Provider
 */
import { SintesiRichiesteService } from '../../../core/service/lista-richieste-service/lista-richieste.service';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { RichiestaFissataState } from '../store/states/richieste/richiesta-fissata.state';
import { RichiestaHoverState } from '../store/states/richieste/richiesta-hover.state';
import { RichiestaSelezionataState } from '../store/states/richieste/richiesta-selezionata.state';
import { ActionRichiestaModalComponent, ListaEntiComponent, MezzoActionsModalComponent, ModificaFonogrammaModalComponent, DettaglioFonogrammaModalComponent  } from '../../../shared';
import { ListaSquadrePartenzaComponent } from '../../../shared/components/lista-squadre-partenza/lista-squadre-partenza.component';
import { RichiesteEspanseState } from '../store/states/richieste/richieste-espanse.state';
import { RichiestaGestioneState } from '../store/states/richieste/richiesta-gestione.state';
import { RichiestaAttivitaUtenteState } from '../store/states/richieste/richiesta-attivita-utente.state';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { ModalFiltriTipologiaComponent } from '../filterbar/filtri-richieste/modal-filtri-tipologia/modal-filtri-tipologia.component';
import { EliminaPartenzaModalComponent } from '../../../shared/modal/elimina-partenza-modal/elimina-partenza-modal.component';
import { TagInputModule } from 'ngx-chips';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        FilterPipeModule,
        NgbModule,
        UiSwitchModule.forRoot(null),
        NgSelectModule,
        SharedModule.forRoot(),
        ScrollingModule,
        SintesiRichiestaModule,
        GooglePlaceModule,
        TagInputModule,
        NgxsModule.forFeature([
            RichiesteState,
            RichiestaFissataState,
            RichiestaHoverState,
            RichiestaSelezionataState,
            RichiesteEspanseState,
            RichiestaGestioneState,
            RichiestaAttivitaUtenteState
        ]),
        NgxsFormPluginModule
    ],
    declarations: [
        RichiesteComponent,
        ListaRichiesteComponent,
        RichiestaFissataComponent,
        SintesiRichiestaSmComponent,
        ModificaRichiestaComponent,
    ],
    exports: [
        RichiesteComponent,
        ModificaRichiestaComponent,
    ],
    entryComponents: [
        ListaEntiComponent,
        ListaSquadrePartenzaComponent,
        ActionRichiestaModalComponent,
        ModalFiltriTipologiaComponent,
        EliminaPartenzaModalComponent,
        MezzoActionsModalComponent,
        DettaglioFonogrammaModalComponent,
        ModificaFonogrammaModalComponent
    ],
    providers: [
        SintesiRichiesteService
    ]
})
export class RichiesteModule {
}
