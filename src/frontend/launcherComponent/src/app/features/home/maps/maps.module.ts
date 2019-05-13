import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipeModule } from '../../../shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
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
    CentroMappaService, MezziMarkerService, SediMarkerService, RichiesteMarkerService,
    CentroMappaServiceFake, MezziMarkerServiceFake, SediMarkerServiceFake, RichiesteMarkerServiceFake, ChiamateMarkerService, ChiamateMarkerServiceFake
} from '../../../core/service/maps-service';
import { RichiesteMarkerAdapterService } from '../../../core/service/maps-service/richieste-marker/adapters/richieste-marker-adapter.service';

/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { MarkerMeteoState } from '../store/states/filterbar/marker-meteo-switch.state';
import { MeteoMarkersState } from '../store/states/maps/meteo-markers.state';
import { MapsFiltroState } from '../store/states/maps/maps-filtro.state';
import { MapsDirectionState } from '../store/states/maps/maps-direction.state';
import { MarkerState } from '../store/states/maps/marker.state';
import { MezziMarkersState } from '../store/states/maps/mezzi-markers.state';
import { SediMarkersState } from '../store/states/maps/sedi-markers.state';
import { RichiesteMarkersState } from '../store/states/maps/richieste-markers.state';
import { CentroMappaState } from '../store/states/maps/centro-mappa.state';
import { SintesiRichiestaModalComponent } from './maps-ui/info-window/sintesi-richiesta-modal/sintesi-richiesta-modal.component';
import { SintesiRichiestaModule } from '../richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.module';
import { MarkerInfoWindowState } from '../store/states/maps/marker-info-window.state';
import { MarkerOpachiState } from '../store/states/maps/marker-opachi.state';
import { ChiamateMarkersState } from '../store/states/maps/chiamate-markers.state';
import { MapsButtonComponent } from './maps-ui/buttons/maps-button.component';
import { MapsButtonsState } from '../store/states/maps/maps-buttons.state';
import { environment } from '../../../../environments/environment';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        PipeModule.forRoot(),
        AgmCoreModule.forRoot(),
        AgmDirectionModule,
        AgmJsMarkerClustererModule,
        AgmSnazzyInfoWindowModule,
        SintesiRichiestaModule,
        SharedModule.forRoot(),
        NgxsModule.forFeature(
            [
                MapsFiltroState,
                MapsDirectionState,
                CentroMappaState,
                MarkerMeteoState,
                MarkerState,
                RichiesteMarkersState,
                MezziMarkersState,
                SediMarkersState,
                MarkerInfoWindowState,
                MarkerOpachiState,
                ChiamateMarkersState,
                MeteoMarkersState,
                MapsButtonsState
            ]
        ),
    ],
    declarations: [
        MapsComponent,
        AgmComponent,
        AgmContentComponent,
        MapsFiltroComponent,
        InfoWindowComponent,
        CambioSedeModalComponent,
        SintesiRichiestaModalComponent,
        MapsButtonComponent
    ],
    entryComponents: [CambioSedeModalComponent, SintesiRichiestaModalComponent],
    exports: [
        MapsComponent
    ],
    providers: [
        RichiesteMarkerAdapterService,
        { provide: RichiesteMarkerService, useClass: environment.fakeProvider ? RichiesteMarkerServiceFake : RichiesteMarkerService },
        // { provide: MezziMarkerService, useClass: environment.fakeProvider ? MezziMarkerServiceFake : MezziMarkerService},
        // { provide: SediMarkerService, useClass: environment.fakeProvider ? SediMarkerServiceFake : SediMarkerService},
        { provide: MezziMarkerService, useClass: MezziMarkerServiceFake },
        { provide: SediMarkerService, useClass: SediMarkerServiceFake },
        { provide: CentroMappaService, useClass: CentroMappaServiceFake },
        { provide: ChiamateMarkerService, useClass: ChiamateMarkerServiceFake }
    ]
})
export class MapsModule {
}
