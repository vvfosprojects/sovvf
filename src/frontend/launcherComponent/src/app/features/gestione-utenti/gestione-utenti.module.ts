import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FilterPipeModule} from 'ngx-filter-pipe';
/**
 * Component
 */
import {GestioneUtentiComponent} from './gestione-utenti.component';
import {ListaUtentiComponent} from './lista-utenti/lista-utenti.component';
import { RicercaUtentiComponent } from './ricerca-utenti/ricerca-utenti.component';
/**
 * Routing
 */
import {GestioneUtentiRouting} from './gestione-utenti.routing';
/**
 * Module
 */
import {PipeModule} from '../../shared/pipes/pipe.module';
import {SharedModule} from '../../shared/shared.module';
/**
 * Ngxs
 */
import {NgxsModule} from '@ngxs/store';
import {RicercaUtentiState} from './store/states/ricerca-utenti/ricerca-utenti.state';


@NgModule({
    declarations: [GestioneUtentiComponent, ListaUtentiComponent, RicercaUtentiComponent],
    imports: [
        CommonModule,
        FormsModule,
        GestioneUtentiRouting,
        NgbModule,
        FilterPipeModule,
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        NgxsModule.forFeature(
            [
                RicercaUtentiState
            ]
        ),
    ]
})
export class GestioneUtentiModule {
}
