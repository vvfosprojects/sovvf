import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/**
 * Component
 */
import { RubricaComponent } from './rubrica.component';
import { TabellaRubricaComponent } from './tabella-rubrica/tabella-rubrica.component';
import { VociRubricaPerPaginaComponent } from './tabella-rubrica/voci-rubrica-per-pagina/voci-rubrica-per-pagina.component';
import { RisultatiPaginazioneComponent } from './tabella-rubrica/risultati-paginazione/risultati-paginazione.component';
import { RicercaRubricaComponent } from './ricerca-rubrica/ricerca-rubrica.component';
/**
 * Routing
 */
import { RubricaRouting } from './rubrica.routing';

/**
 * States
 */
import { NgxsModule } from '@ngxs/store';
import { RicercaRubricaState } from './store/states/ricerca-rubrica/ricerca-rubrica.state';
import { RubricaState } from './store/states/rubrica/rubrica.state';


@NgModule({
    declarations: [
        RubricaComponent,
        TabellaRubricaComponent,
        VociRubricaPerPaginaComponent,
        RisultatiPaginazioneComponent,
        RicercaRubricaComponent
    ],
    imports: [
        CommonModule,
        RubricaRouting,
        NgxsModule.forFeature([
            RubricaState,
            RicercaRubricaState
        ]),
    ],
    entryComponents: [],
    providers: []
})
export class RubricaModule {
}
