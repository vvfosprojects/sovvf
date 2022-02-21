import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
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
import { ChiamateMarkerService } from '../../core/service/maps-service';
import { MapService } from './map-service/map-service.service';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { MapsDirectionState } from './store/states/maps-direction.state';
import { CentroMappaState } from './store/states/centro-mappa.state';
import { ChiamateMarkersState } from './store/states/chiamate-markers.state';
import { TravelModeService } from './map-service/travel-mode.service';
import { EsriService } from './map-service/esri.service';

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
        ChiamateMarkerService,
        MapService,
        EsriService,
        TravelModeService
    ]
})
export class MapsModule {
}
