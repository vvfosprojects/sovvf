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
import { RubricaPersonaleComponent } from './rubrica-personale.component';
/**
 * Routing
 */
import { RubricaPersonaleRouting } from './rubrica-personale.routing';
import { TabellaRubricaPersonaleComponent } from './tabella-rubrica-personale/tabella-rubrica-personale.component';
import { RubricaPersonaleState } from './store/states/rubrica-personale/rubrica-personale.state';
import { RicercaRubricaPersonaleComponent } from './ricerca-rubrica-personale/ricerca-rubrica-personale.component';
import { RicercaRubricaPersonaleState } from './store/states/ricerca-rubrica-personale/ricerca-rubrica-personale.state';

/**
 * States
 */


@NgModule({
    declarations: [
        RubricaPersonaleComponent,
        TabellaRubricaPersonaleComponent,
        RicercaRubricaPersonaleComponent
    ],
    imports: [
        CommonModule,
        RubricaPersonaleRouting,
        TreeviewModule.forRoot(),
        SharedModule.forRoot(),
        NgxsModule.forFeature([
            RubricaPersonaleState,
            RicercaRubricaPersonaleState,
        ]),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        NgxPaginationModule,
        NgbModule,
        SharedModule
    ],
    providers: []
})
export class RubricaPersonaleModule {
}
