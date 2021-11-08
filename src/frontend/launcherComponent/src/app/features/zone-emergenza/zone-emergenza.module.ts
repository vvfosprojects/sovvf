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
import { NgWizardConfig, NgWizardModule, THEME } from 'ng-wizard';
/**
 * Component
 */
import { ZoneEmergenzaComponent } from './zone-emergenza.component';
import { TabellaZoneEmergenzaComponent } from './tabella-zone-emergenza/tabella-zone-emergenza.component';
import { ModuliColonnaMobileModalComponent } from './moduli-colonna-mobile-modal/moduli-colonna-mobile-modal.component';
/**
 * Routing
 */
import { ZoneEmergenzaRouting } from './zone-emergenza.routing';
/**
 * States
 */
import { ZoneEmergenzaState } from './store/states/zone-emergenza/zone-emergenza.state';
import { ModuliColonnaMobileState } from './store/states/moduli-colonna-mobile/moduli-colonna-mobile.state';

const ngWizardConfig: NgWizardConfig = {
    theme: THEME.default
};

@NgModule({
    declarations: [
        ZoneEmergenzaComponent,
        TabellaZoneEmergenzaComponent,
        ModuliColonnaMobileModalComponent
    ],
    imports: [
        CommonModule,
        ZoneEmergenzaRouting,
        NgWizardModule.forRoot(ngWizardConfig),
        TreeviewModule.forRoot(),
        SharedModule.forRoot(),
        NgxsModule.forFeature([
            ZoneEmergenzaState,
            ModuliColonnaMobileState
        ]),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        NgbModule,
        SharedModule,
        MapsModule,
    ],
    providers: []
})
export class ZoneEmergenzaModule {
}
