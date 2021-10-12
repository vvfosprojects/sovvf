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
import { SediMarkerService, ChiamateMarkerService } from '../../../core/service/maps-service';
import { MapService } from './map-service/map-service.service';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { MapsDirectionState } from '../store/states/maps/maps-direction.state';
import { MarkerState } from '../store/states/maps/marker.state';
import { SediMarkersState } from '../store/states/maps/sedi-markers.state';
import { CentroMappaState } from '../store/states/maps/centro-mappa.state';
import { ChiamateMarkersState } from '../store/states/maps/chiamate-markers.state';
import { AreaMappaState } from '../store/states/maps/area-mappa.state';
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
                SediMarkersState,
                ChiamateMarkersState
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
        SediMarkerService,
        ChiamateMarkerService,
        MapService
    ]
})
export class MapsModule {
}
