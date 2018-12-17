import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipeModule } from '../shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { SharedModule } from '../shared/shared.module';
import { ToastrModule } from 'ngx-toastr';

/**
 * AGM CORE
 */
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmDirectionModule } from 'agm-direction';

/**
 * MAPS
 */
import { MapsComponent } from './maps.component';
import { AgmComponent } from './agm/agm.component';
import { AgmContentComponent } from './agm/agm-content.component';
/**
 * MAPS-UI
 */
import { MapsFiltroComponent } from './maps-ui/filtro/filtro.component';
import { InfoWindowComponent } from './maps-ui/info-window/info-window.component';
import { CambioSedeModalComponent } from './maps-ui/info-window/cambio-sede-modal/cambio-sede-modal.component';
/**
 * Provider
 */
import {
    CentroMappaManagerService, MezziMarkerManagerService, SediMarkerManagerService, RichiesteMarkerManagerService,
    CentroMappaManagerServiceFake, MezziMarkerManagerServiceFake, SediMarkerManagerServiceFake, RichiesteMarkerManagerServiceFake
} from '../core/manager/maps-manager';
import {
    DispatcherCentroMappaService, DispatcherMezziMarkerService, DispatcherSediMarkerService, DispatcherRichiesteMarkerService,
    DispatcherCentroMappaServiceFake, DispatcherMezziMarkerServiceFake,
    DispatcherSediMarkerServiceFake, DispatcherRichiesteMarkerServiceFake
} from '../core/dispatcher/dispatcher-maps/';
import {
    CentroMappaService, MezziMarkerService, SediMarkerService, RichiesteMarkerService,
    CentroMappaServiceFake, MezziMarkerServiceFake, SediMarkerServiceFake, RichiesteMarkerServiceFake
} from '../core/service/maps-service/';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        PipeModule.forRoot(),
        AgmCoreModule.forRoot(),
        AgmDirectionModule,
        AgmJsMarkerClustererModule,
        AgmSnazzyInfoWindowModule,
        SharedModule.forRoot(),
        ToastrModule.forRoot({
            positionClass: 'toast-top-center',
            preventDuplicates: true,
        }),
    ],
    declarations: [
        MapsComponent,
        AgmComponent,
        AgmContentComponent,
        MapsFiltroComponent,
        InfoWindowComponent,
        CambioSedeModalComponent
    ],
    entryComponents: [CambioSedeModalComponent],
    exports: [
        MapsComponent
    ],
    providers: [
        // {provide: RichiesteMarkerService, useClass: RichiesteMarkerServiceFake},
        // {provide: RichiesteMarkerManagerService, useClass: RichiesteMarkerManagerServiceFake},
        // {provide: DispatcherRichiesteMarkerService, useClass: DispatcherRichiesteMarkerServiceFake},
        // {provide: MezziMarkerService, useClass: MezziMarkerServiceFake},
        // {provide: MezziMarkerManagerService, useClass: MezziMarkerManagerServiceFake},
        // {provide: DispatcherMezziMarkerService, useClass: DispatcherMezziMarkerServiceFake},
        // {provide: SediMarkerService, useClass: SediMarkerServiceFake},
        // {provide: SediMarkerManagerService, useClass: SediMarkerManagerServiceFake},
        // {provide: DispatcherSediMarkerService, useClass: DispatcherSediMarkerServiceFake},
        {provide: CentroMappaService, useClass: CentroMappaServiceFake},
        {provide: CentroMappaManagerService, useClass: CentroMappaManagerServiceFake},
        {provide: DispatcherCentroMappaService, useClass: DispatcherCentroMappaServiceFake},
    ]
})
export class MapsModule {
}
