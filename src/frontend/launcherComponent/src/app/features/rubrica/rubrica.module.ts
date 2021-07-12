import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
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
        NgbModule,
        SharedModule
    ],
    providers: []
})
export class RubricaModule {
}
