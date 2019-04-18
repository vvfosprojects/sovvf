import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeviewModule } from 'ngx-treeview';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgSelectModule } from '@ng-select/ng-select';
/**
 * Component
 */
import { GestioneUtentiComponent } from './gestione-utenti.component';
import { RicercaUtentiComponent } from './ricerca-utenti/ricerca-utenti.component';
import { TabellaUtentiComponent } from './tabella-utenti/tabella-utenti.component';
import { UtentiPerPaginaComponent } from './tabella-utenti/utenti-per-pagina/utenti-per-pagina.component';
import { RisultatiPaginazioneComponent } from './tabella-utenti/risultati-paginazione/risultati-paginazione.component';
import { AggiungiUtenteModalComponent } from './aggiungi-utente-modal/aggiungi-utente-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
/**
 * Routing
 */
import { GestioneUtentiRouting } from './gestione-utenti.routing';
/**
 * Module
 */
import { PipeModule } from '../../shared/pipes/pipe.module';
import { SharedModule } from '../../shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';
/**
 * Service
 */
import { GestioneUtentiService } from '../../core/service/gestione-utenti-service/gestione-utenti.service';
import { GestioneUtentiServiceFake } from '../../core/service/gestione-utenti-service/gestione-utenti.service.fake';
import { RuoliService } from '../../core/service/ruoli-service/ruoli-service.service';
import { RuoliServiceFake } from '../../core/service/ruoli-service/ruoli.service.fake';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { RicercaUtentiState } from './store/states/ricerca-utenti/ricerca-utenti.state';
import { TabellaUtentiState } from './store/states/tabella-utenti/tabella-utenti.state';
import { GestioneUtentiState } from './store/states/gestione-utenti/gestione-utenti.state';
import { UtentiState } from '../home/store/states/utenti/utenti.state';
import { RuoliState } from './store/states/ruoli/ruoli.state';


@NgModule({
    declarations: [GestioneUtentiComponent, RicercaUtentiComponent, TabellaUtentiComponent, UtentiPerPaginaComponent, RisultatiPaginazioneComponent, AggiungiUtenteModalComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GestioneUtentiRouting,
        NgbModule,
        NgSelectModule,
        FilterPipeModule,
        SharedModule,
        TreeviewModule.forRoot(),
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        UiSwitchModule.forRoot(null),
        NgxsModule.forFeature(
            [
                RicercaUtentiState,
                TabellaUtentiState,
                GestioneUtentiState,
                UtentiState,
                RuoliState
            ]
        ),
    ],
    entryComponents: [AggiungiUtenteModalComponent, ConfirmModalComponent],
    providers: [
        {provide: GestioneUtentiService, useClass: GestioneUtentiServiceFake},
        {provide: RuoliService, useClass: RuoliServiceFake}
    ]
})
export class GestioneUtentiModule {
}
