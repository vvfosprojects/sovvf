import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AnnullaZonaEmergenzaModalComponent } from './annulla-zona-emergenza-modal/annulla-zona-emergenza-modal.component';
import { ModuloColonnaMobileComponent } from './moduli-colonna-mobile-modal/modulo-colonna-mobile/modulo-colonna-mobile.component';
import { AllertaCONZonaEmergenzaModalComponent } from './allerta-CON-zona-emergenza-modal/allerta-CON-zona-emergenza-modal.component';
import { DettaglioZonaEmergenzaComponent } from './dettaglio-zona-emergenza/dettaglio-zona-emergenza.component';
import { ZonaEmergenzaModalComponent } from './zona-emergenza-modal/zona-emergenza-modal.component';
import { SediZonaEmergenzaComponent } from './sedi-zona-emergenza/sedi-zona-emergenza.component';
import { DoaModalComponent } from './sedi-zona-emergenza/doa-modal/doa-modal.component';
/**
 * Routing
 */
import { ZoneEmergenzaRouting } from './zone-emergenza.routing';
/**
 * States
 */
import { ZoneEmergenzaState } from './store/states/zone-emergenza/zone-emergenza.state';
import { ModuliColonnaMobileState } from './store/states/moduli-colonna-mobile/moduli-colonna-mobile.state';
// import { PcaModalComponent } from './sedi-zona-emergenza/pca-modal/pca-modal.component';

const ngWizardConfig: NgWizardConfig = {
    theme: THEME.default
};

@NgModule({
    declarations: [
        ZoneEmergenzaComponent,
        TabellaZoneEmergenzaComponent,
        ModuliColonnaMobileModalComponent,
        AnnullaZonaEmergenzaModalComponent,
        AllertaCONZonaEmergenzaModalComponent,
        ModuloColonnaMobileComponent,
        DettaglioZonaEmergenzaComponent,
        ZonaEmergenzaModalComponent,
        SediZonaEmergenzaComponent,
        DoaModalComponent,
        // PcaModalComponent
    ],
    imports: [
        CommonModule,
        ZoneEmergenzaRouting,
        NgWizardModule.forRoot(ngWizardConfig),
        TreeviewModule.forRoot(),
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
        ReactiveFormsModule,
    ],
    providers: []
})
export class ZoneEmergenzaModule {
}
