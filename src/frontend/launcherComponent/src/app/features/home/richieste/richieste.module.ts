/**
 * Modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { TagInputModule } from 'ngx-chips';
/**
 * Components
 */
import { RichiesteComponent } from './richieste.component';
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';
import { RichiestaFissataComponent } from './richiesta-fissata/richiesta-fissata.component';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { RichiestaFissataState } from '../store/states/richieste/richiesta-fissata.state';
import { RichiestaHoverState } from '../store/states/richieste/richiesta-hover.state';
import { RichiestaSelezionataState } from '../store/states/richieste/richiesta-selezionata.state';
import { RichiestaGestioneState } from '../store/states/richieste/richiesta-gestione.state';
import { RichiestaAttivitaUtenteState } from '../store/states/richieste/richiesta-attivita-utente.state';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FilterPipeModule,
        NgbModule,
        UiSwitchModule.forRoot(null),
        NgSelectModule,
        SharedModule.forRoot(),
        TagInputModule,
        NgxsModule.forFeature([
            RichiesteState,
            RichiestaFissataState,
            RichiestaHoverState,
            RichiestaSelezionataState,
            RichiestaGestioneState,
            RichiestaAttivitaUtenteState
        ]),
        NgxsFormPluginModule,
        SharedModule
    ],
    declarations: [
        RichiesteComponent,
        ListaRichiesteComponent,
        RichiestaFissataComponent
    ],
    exports: [
        RichiesteComponent,
        ListaRichiesteComponent
    ]
})
export class RichiesteModule {
}
