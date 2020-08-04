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
import { GestioneUtenteModalComponent } from './gestione-utente-modal/gestione-utente-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
/**
 * Routing
 */
import { GestioneUtentiRouting } from './gestione-utenti.routing';
/**
 * Module
 */
import { SharedModule } from '../../shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { RicercaUtentiState } from './store/states/ricerca-utenti/ricerca-utenti.state';
import { GestioneUtentiState } from './store/states/gestione-utenti/gestione-utenti.state';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { RubricaState } from '../rubrica/store/states/rubrica/rubrica.state';


@NgModule({
    declarations: [GestioneUtentiComponent, RicercaUtentiComponent, TabellaUtentiComponent, UtentiPerPaginaComponent, RisultatiPaginazioneComponent, GestioneUtenteModalComponent],
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
        SharedModule.forRoot(),
        UiSwitchModule.forRoot(null),
        NgxsModule.forFeature(
            [
                GestioneUtentiState,
                RicercaUtentiState
            ]
        ),
        NgxPaginationModule,
        NgxsFormPluginModule,
    ],
    entryComponents: [GestioneUtenteModalComponent, ConfirmModalComponent],
    providers: []
})
export class GestioneUtentiModule {
}
