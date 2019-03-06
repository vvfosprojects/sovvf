import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TreeviewModule} from 'ngx-treeview';
import {FilterPipeModule} from 'ngx-filter-pipe';
/**
 * Component
 */
import {GestioneUtentiComponent} from './gestione-utenti.component';
import {ListaUtentiComponent} from './lista-utenti/lista-utenti.component';
import { RicercaUtentiComponent } from './ricerca-utenti/ricerca-utenti.component';
import { TabellaUtentiComponent } from './tabella-utenti/tabella-utenti.component';
/**
 * Routing
 */
import {GestioneUtentiRouting} from './gestione-utenti.routing';
/**
 * Module
 */
import {PipeModule} from '../../shared/pipes/pipe.module';
import {SharedModule} from '../../shared/shared.module';
import {UiSwitchModule} from 'ngx-ui-switch';
/**
 * Ngxs
 */
import {NgxsModule} from '@ngxs/store';
import {RicercaUtentiState} from './store/states/ricerca-utenti/ricerca-utenti.state';


@NgModule({
    declarations: [GestioneUtentiComponent, ListaUtentiComponent, RicercaUtentiComponent, TabellaUtentiComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GestioneUtentiRouting,
        NgbModule,
        FilterPipeModule,
        TreeviewModule.forRoot(),
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        UiSwitchModule.forRoot(null),
        NgxsModule.forFeature(
            [
                RicercaUtentiState
            ]
        ),
    ]
})
export class GestioneUtentiModule {
}
