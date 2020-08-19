import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { TreeviewModule } from 'ngx-treeview';
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/**
 * Component
 */
import { RubricaComponent } from './rubrica.component';
import { TabellaRubricaComponent } from './tabella-rubrica/tabella-rubrica.component';
import { RicercaRubricaComponent } from './ricerca-rubrica/ricerca-rubrica.component';
import { EnteModalComponent } from '../../shared/modal/ente-modal/ente-modal.component';
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
        NgbModule
    ],
    entryComponents: [EnteModalComponent, ConfirmModalComponent],
    providers: []
})
export class RubricaModule {
}
