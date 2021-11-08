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
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { RicercaUtentiState } from './store/states/ricerca-utenti/ricerca-utenti.state';
import { GestioneUtentiState } from './store/states/gestione-utenti/gestione-utenti.state';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { MapsModule } from '../maps/maps.module';

@NgModule({
    declarations: [
        GestioneUtentiComponent,
        RicercaUtentiComponent,
        TabellaUtentiComponent,
        GestioneUtenteModalComponent
    ],
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
        NgxsModule.forFeature(
            [
                GestioneUtentiState,
                RicercaUtentiState
            ]
        ),
        NgxsFormPluginModule,
        MapsModule,
    ],
    providers: []
})
export class GestioneUtentiModule {
}
