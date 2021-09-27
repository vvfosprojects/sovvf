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
import { AreaDocumentaleComponent } from './area-documentale.component';
import { TabellaDocumentiComponent } from './tabella-documenti/tabella-documenti.component';
import { RicercaAreaDocumentaleComponent } from './ricerca-area-documentale/ricerca-area-documentale.component';
/**
 * Routing
 */
import { AreaDocumentaleRouting } from './area-documentale.routing';
/**
 * States
 */
import { AreaDocumentaleState } from './store/states/area-documentale/area-documentale.state';
import { RicercaAreaDocumentaleState } from './store/states/ricerca-area-documentale/ricerca-area-documentale.state';


@NgModule({
    declarations: [
        AreaDocumentaleComponent,
        TabellaDocumentiComponent,
        RicercaAreaDocumentaleComponent
    ],
    imports: [
        CommonModule,
        AreaDocumentaleRouting,
        TreeviewModule.forRoot(),
        SharedModule.forRoot(),
        NgxsModule.forFeature([
            AreaDocumentaleState,
            RicercaAreaDocumentaleState
        ]),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        NgbModule,
        SharedModule
    ],
    providers: []
})
export class AreaDocumentaleModule {
}
