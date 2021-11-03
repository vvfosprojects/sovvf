import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeviewModule } from 'ngx-treeview';
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapsModule } from '../maps/maps.module';
/**
 * Component
 */
import { ZoneEmergenzaComponent } from './zone-emergenza.component';
import { TabellaZoneEmergenzaComponent } from './tabella-zone-emergenza/tabella-zone-emergenza.component';
/**
 * Routing
 */
import { ZoneEmergenzaRouting } from './zone-emergenza.routing';
/**
 * States
 */
import { ZoneEmergenzaState } from './store/states/zone-emergenza/zone-emergenza.state';


@NgModule({
    declarations: [
        ZoneEmergenzaComponent,
        TabellaZoneEmergenzaComponent
    ],
    imports: [
        CommonModule,
        ZoneEmergenzaRouting,
        TreeviewModule.forRoot(),
        SharedModule.forRoot(),
        NgxsModule.forFeature([
            ZoneEmergenzaState
        ]),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        NgbModule,
        SharedModule,
        MapsModule
    ],
    providers: []
})
export class ZoneEmergenzaModule {
}
