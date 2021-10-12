import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CentroMappa } from './maps-model/centro-mappa.model';
import { SedeMarker } from './maps-model/sede-marker.model';
import { ChiamataMarker } from './maps-model/chiamata-marker.model';
import { ComposizioneMarker } from './maps-model/composizione-marker.model';
import { Observable, Subscription } from 'rxjs';
import { ViewInterfaceMaps } from '../../../shared/interface/view.interface';
import { Select } from '@ngxs/store';
import { SediMarkersState } from '../store/states/maps/sedi-markers.state';
import { CentroMappaState } from '../store/states/maps/centro-mappa.state';
import { ChiamateMarkersState } from '../store/states/maps/chiamate-markers.state';
import { ComposizionePartenzaState } from '../store/states/composizione-partenza/composizione-partenza.state';
import { AreaMappaState } from '../store/states/maps/area-mappa.state';
import { AreaMappa } from './maps-model/area-mappa-model';
import { MapsDirectionState } from '../store/states/maps/maps-direction.state';
import { DirectionInterface } from './maps-interface/direction-interface';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import { FiltriRichiesteState } from '../store/states/filterbar/filtri-richieste.state';
import { VoceFiltro } from '../filterbar/filtri-richieste/voce-filtro.model';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {

    @Input() viewStateMappa: ViewInterfaceMaps;
    @Input() boxAttivi: boolean;
    @Input() tastoChiamataMappaActive: boolean;

    @Output() mapFullLoaded: EventEmitter<{ areaMappa: AreaMappa, spatialReference?: SpatialReference }> = new EventEmitter<{ areaMappa: AreaMappa, spatialReference?: SpatialReference }>();

    @Select(CentroMappaState.centroMappa) centroMappa$: Observable<CentroMappa>;
    @Select(ChiamateMarkersState.chiamateMarkers) chiamataMarkers$: Observable<ChiamataMarker[]>;
    @Select(ComposizionePartenzaState.richiestaComposizioneMarker) composizioneMarkers$: Observable<ComposizioneMarker[]>;
    @Select(SediMarkersState.sediMarkers) sediMarkers$: Observable<SedeMarker[]>;
    @Select(AreaMappaState.areaMappaLoading) areaMappaLoading$: Observable<boolean>;
    @Select(MapsDirectionState.direction) direction$: Observable<DirectionInterface>;

    // Filtri Richieste Selezionati
    @Select(FiltriRichiesteState.filtriRichiesteSelezionati) filtriRichiesteSelezionati$: Observable<VoceFiltro[]>;

    mapsFullyLoaded = false;
    centroMappa: CentroMappa;

    private subscription: Subscription = new Subscription();

    constructor() {
        this.subscription.add(this.centroMappa$.subscribe((r: CentroMappa) => {
            this.centroMappa = r;
        }));
    }

    ngOnInit(): void {
        console.log('Componente Maps creato');
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        console.log('Componente Maps distrutto');
    }

    mapIsLoaded(areaMappa: AreaMappa, spatialReference?: SpatialReference ): void {
        if (areaMappa) {
            this.mapsFullyLoaded = true;
            if (this.mapsFullyLoaded) {
                setTimeout(() => {
                    this.mapFullLoaded.emit({ areaMappa, spatialReference });
                }, 2000);
            }
        }
    }
}
