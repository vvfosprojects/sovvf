import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { InfoWindowComponent } from './maps-ui/info-window/info-window.component';
import { CambioSedeModalComponent } from './maps-ui/info-window/cambio-sede-modal/cambio-sede-modal.component';
import { FiltriMarkersComponent } from './maps-ui/filtri-markers/filtri-markers.component';
import { FiltriMarkersRichiesteComponent } from './maps-ui/filtri-markers/filtri-markers-richieste/filtri-markers-richieste.component';
import { FiltriMarkersMezziComponent } from './maps-ui/filtri-markers/filtri-markers-mezzi/filtri-markers-mezzi.component';
/**
 * Provider
 */
import {
    MezziMarkerService, SediMarkerService, RichiesteMarkerService,
    MezziMarkerServiceFake, SediMarkerServiceFake, RichiesteMarkerServiceFake, ChiamateMarkerService, ChiamateMarkerServiceFake
} from '../../../core/service/maps-service';
import { RichiesteMarkerAdapterService } from '../../../core/service/maps-service/richieste-marker/adapters/richieste-marker-adapter.service';

/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { MarkerMeteoState } from '../store/states/filterbar/marker-meteo-switch.state';
import { MeteoMarkersState } from '../store/states/maps/meteo-markers.state';
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
import { AreaMappaState } from '../store/states/maps/area-mappa.state';
import { FiltriMarkersState } from '../store/states/maps/filtri-markers.state';
import { NgSelectModule } from '@ng-select/ng-select';
import { SchedeContattoMarkersState } from '../store/states/maps/schede-contatto-markers.state';
import { SchedeContattoMarkerService } from '../../../core/service/maps-service/schede-contatto-marker/schede-contatto-marker.service';
import { FiltriScComponent } from './maps-ui/filtri-markers/filtri-sc/filtri-sc.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        AgmCoreModule.forRoot(),
        AgmDirectionModule,
        AgmJsMarkerClustererModule,
        AgmSnazzyInfoWindowModule,
        SintesiRichiestaModule,
        SharedModule.forRoot(),
        NgSelectModule,
        NgxsModule.forFeature(
            [
                MapsDirectionState,
                CentroMappaState,
                AreaMappaState,
                MarkerMeteoState,
                MarkerState,
                RichiesteMarkersState,
                MezziMarkersState,
                SediMarkersState,
                MarkerInfoWindowState,
                MarkerOpachiState,
                ChiamateMarkersState,
                MeteoMarkersState,
                MapsButtonsState,
                FiltriMarkersState,
                SchedeContattoMarkersState
            ]
        ),
        FormsModule
    ],
    declarations: [
        MapsComponent,
        AgmComponent,
        AgmContentComponent,
        InfoWindowComponent,
        CambioSedeModalComponent,
        SintesiRichiestaModalComponent,
        MapsButtonComponent,
        FiltriMarkersComponent,
        FiltriMarkersRichiesteComponent,
        FiltriMarkersMezziComponent,
        FiltriScComponent
    ],
    entryComponents: [CambioSedeModalComponent, SintesiRichiestaModalComponent],
    exports: [
        MapsComponent
    ],
    providers: [
        RichiesteMarkerAdapterService,
        SchedeContattoMarkerService,
        { provide: RichiesteMarkerService, useClass: environment.fakeProvider ? RichiesteMarkerServiceFake : RichiesteMarkerService },
        { provide: MezziMarkerService, useClass: environment.fakeProvider ? MezziMarkerServiceFake : MezziMarkerService},
        { provide: SediMarkerService, useClass: environment.fakeProvider ? SediMarkerServiceFake : SediMarkerService},
        { provide: ChiamateMarkerService, useClass: environment.fakeProvider ? ChiamateMarkerServiceFake : ChiamateMarkerService}
    ]
})
export class MapsModule {
}
