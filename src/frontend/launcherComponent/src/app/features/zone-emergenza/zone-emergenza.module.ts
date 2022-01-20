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
import { PieChartModule } from '@swimlane/ngx-charts';
import { NgWizardConfig, NgWizardModule, THEME } from 'ng-wizard';
/**
 * Component
 */
import { ZoneEmergenzaComponent } from './zone-emergenza.component';
import { TabellaZoneEmergenzaComponent } from './tabella-zone-emergenza/tabella-zone-emergenza.component';
import { ModuliColonnaMobileModalComponent } from './moduli-colonna-mobile-modal/moduli-colonna-mobile-modal.component';
import { AnnullaZonaEmergenzaModalComponent } from './annulla-zona-emergenza-modal/annulla-zona-emergenza-modal.component';
import { ModuloColonnaMobileComponent } from './shared/modulo-colonna-mobile/modulo-colonna-mobile.component';
import { AllertaCONZonaEmergenzaModalComponent } from './allerta-CON-zona-emergenza-modal/allerta-CON-zona-emergenza-modal.component';
import { DettaglioZonaEmergenzaComponent } from './dettaglio-zona-emergenza/dettaglio-zona-emergenza.component';
import { ZonaEmergenzaModalComponent } from './zona-emergenza-modal/zona-emergenza-modal.component';
import { DoaModalComponent } from './sedi-zona-emergenza/creazione-sedi/doa-modal/doa-modal.component';
import { PcaModalComponent } from './sedi-zona-emergenza/creazione-sedi/pca-modal/pca-modal.component';
import { DoaComponent } from './sedi-zona-emergenza/creazione-sedi/doa/doa.component';
import { PcaComponent } from './sedi-zona-emergenza/creazione-sedi/pca/pca.component';
import { RichiestaModuliModalComponent } from './richiesta-moduli-modal/richiesta-moduli-modal.component';
import { RichiestaCraModalComponent } from './richiesta-cra-modal/richiesta-cra-modal.component';
/**
 * Routing
 */
import { ZoneEmergenzaRouting } from './zone-emergenza.routing';
/**
 * States
 */
import { ZoneEmergenzaState } from './store/states/zone-emergenza/zone-emergenza.state';
import { ModuliColonnaMobileState } from './store/states/moduli-colonna-mobile/moduli-colonna-mobile.state';
import { CreazioneSediComponent } from './sedi-zona-emergenza/creazione-sedi/creazione-sedi.component';
import { DettaglioSediComponent } from './sedi-zona-emergenza/dettaglio-sedi/dettaglio-sedi.component';

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
        RichiestaModuliModalComponent,
        RichiestaCraModalComponent,
        ModuloColonnaMobileComponent,
        DettaglioZonaEmergenzaComponent,
        ZonaEmergenzaModalComponent,
        CreazioneSediComponent,
        DettaglioSediComponent,
        DoaModalComponent,
        PcaModalComponent,
        DoaComponent,
        PcaComponent
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
        PieChartModule,
    ],
    providers: []
})
export class ZoneEmergenzaModule {
}
