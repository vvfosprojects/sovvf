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
import { PosComponent } from './pos.component';
import { TabellaPosComponent } from './tabella-pos/tabella-pos.component';
import { RicercaPosComponent } from './ricerca-pos/ricerca-pos.component';
/**
 * Routing
 */
import { PosRouting } from './pos.routing';
/**
 * States
 */
import { PosState } from './store/states/pos/pos.state';
import { RicercaPosState } from './store/states/ricerca-pos/ricerca-pos.state';


@NgModule({
    declarations: [
        PosComponent,
        TabellaPosComponent,
        RicercaPosComponent
    ],
    imports: [
        CommonModule,
        PosRouting,
        TreeviewModule.forRoot(),
        SharedModule.forRoot(),
        NgxsModule.forFeature([
            PosState,
            RicercaPosState
        ]),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        NgbModule,
        SharedModule
    ],
    providers: []
})
export class PosModule {
}
