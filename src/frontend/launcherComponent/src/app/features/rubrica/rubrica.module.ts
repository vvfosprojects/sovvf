import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { TreeviewModule } from 'ngx-treeview';
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
/**
 * Component
 */
import { RubricaComponent } from './rubrica.component';
import { TabellaRubricaComponent } from './tabella-rubrica/tabella-rubrica.component';
import { VociRubricaPerPaginaComponent } from './tabella-rubrica/voci-rubrica-per-pagina/voci-rubrica-per-pagina.component';
import { RisultatiPaginazioneComponent } from './tabella-rubrica/risultati-paginazione/risultati-paginazione.component';
import { RicercaRubricaComponent } from './ricerca-rubrica/ricerca-rubrica.component';
import { VoceRubricaModalComponent } from '../../shared/modal/voce-rubrica-modal/voce-rubrica-modal.component';
import { ConfirmModalComponent } from '../../shared';
/**
 * Routing
 */
import { RubricaRouting } from './rubrica.routing';

/**
 * States
 */
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
        TreeviewModule.forRoot(),
        SharedModule.forRoot(),
        NgxsModule.forFeature([
            RubricaState,
            RicercaRubricaState
        ]),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        NgxPaginationModule,
    ],
    entryComponents: [VoceRubricaModalComponent, ConfirmModalComponent],
    providers: []
})
export class RubricaModule {
}
