import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
/**
 * Component
 */
import { MapsComponent } from './maps.component';
import { MapEsriComponent } from './map-esri/map-esri.component';
import { ModalNuovaChiamataComponent } from './modal-nuova-chiamata/modal-nuova-chiamata.component';
/**
 * Provider
 */
import {
    SediMarkerService,
    RichiesteMarkerService,
    ChiamateMarkerService
} from '../../../core/service/maps-service';
import { RichiesteMarkerAdapterService } from '../../../core/service/maps-service/richieste-marker/adapters/richieste-marker-adapter.service';
import { SchedeContattoMarkerService } from '../../../core/service/maps-service/schede-contatto-marker/schede-contatto-marker.service';
import { MapService } from './map-service/map-service.service';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { MapsDirectionState } from '../store/states/maps/maps-direction.state';
import { MarkerState } from '../store/states/maps/marker.state';
import { SediMarkersState } from '../store/states/maps/sedi-markers.state';
import { RichiesteMarkersState } from '../store/states/maps/richieste-markers.state';
import { CentroMappaState } from '../store/states/maps/centro-mappa.state';
import { ChiamateMarkersState } from '../store/states/maps/chiamate-markers.state';
import { AreaMappaState } from '../store/states/maps/area-mappa.state';
import { SchedeContattoMarkersState } from '../store/states/maps/schede-contatto-markers.state';
import { MappaState } from '../store/states/maps/mappa.state';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        SharedModule,
        NgSelectModule,
        NgxsModule.forFeature(
            [
                MappaState,
                MapsDirectionState,
                CentroMappaState,
                AreaMappaState,
                MarkerState,
                RichiesteMarkersState,
                SediMarkersState,
                ChiamateMarkersState,
                SchedeContattoMarkersState
            ]
        )
    ],
    declarations: [
        MapsComponent,
        MapEsriComponent,
        ModalNuovaChiamataComponent
    ],
    exports: [
        MapsComponent
    ],
    providers: [
        RichiesteMarkerAdapterService,
        SchedeContattoMarkerService,
        RichiesteMarkerService,
        SediMarkerService,
        ChiamateMarkerService,
        MapService
    ]
})
export class MapsModule {
}
