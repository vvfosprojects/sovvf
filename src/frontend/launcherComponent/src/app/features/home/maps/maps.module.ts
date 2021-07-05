import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
/**
 * MAPS
 */
import { MapsComponent } from './maps.component';
/**
 * MAPS-UI
 */
import { FiltriMarkersComponent } from './maps-ui/filtri-markers/filtri-markers.component';
import { FiltriMarkersRichiesteComponent } from './maps-ui/filtri-markers/filtri-markers-richieste/filtri-markers-richieste.component';
import { FiltriMarkersMezziComponent } from './maps-ui/filtri-markers/filtri-markers-mezzi/filtri-markers-mezzi.component';
/**
 * Provider
 */
import {
    MezziMarkerService,
    SediMarkerService,
    RichiesteMarkerService,
    ChiamateMarkerService
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
import { MarkerInfoWindowState } from '../store/states/maps/marker-info-window.state';
import { MarkerOpachiState } from '../store/states/maps/marker-opachi.state';
import { ChiamateMarkersState } from '../store/states/maps/chiamate-markers.state';
import { MapsButtonComponent } from './maps-ui/buttons/maps-button.component';
import { MapsButtonsState } from '../store/states/maps/maps-buttons.state';
import { AreaMappaState } from '../store/states/maps/area-mappa.state';
import { FiltriMarkersState } from '../store/states/maps/filtri-markers.state';
import { NgSelectModule } from '@ng-select/ng-select';
import { SchedeContattoMarkersState } from '../store/states/maps/schede-contatto-markers.state';
import { SchedeContattoMarkerService } from '../../../core/service/maps-service/schede-contatto-marker/schede-contatto-marker.service';
import { FiltriScComponent } from './maps-ui/filtri-markers/filtri-sc/filtri-sc.component';
import { EsriMapComponent } from './esri-map/esri-map.component';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        SharedModule,
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
        )
    ],
    declarations: [
        MapsComponent,
        MapsButtonComponent,
        FiltriMarkersComponent,
        FiltriMarkersRichiesteComponent,
        FiltriMarkersMezziComponent,
        FiltriScComponent,
        EsriMapComponent
    ],
    exports: [
        MapsComponent
    ],
    providers: [
        RichiesteMarkerAdapterService,
        SchedeContattoMarkerService,
        RichiesteMarkerService,
        MezziMarkerService,
        SediMarkerService,
        ChiamateMarkerService
    ]
})
export class MapsModule {
}
