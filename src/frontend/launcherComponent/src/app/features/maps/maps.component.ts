import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CentroMappa } from './maps-model/centro-mappa.model';
import { SedeMarker } from './maps-model/sede-marker.model';
import { ChiamataMarker } from './maps-model/chiamata-marker.model';
import { ComposizioneMarker } from './maps-model/composizione-marker.model';
import { Observable, Subscription } from 'rxjs';
import { ViewInterfaceMaps } from '../../shared/interface/view.interface';
import { Select, Store } from '@ngxs/store';
import { SediMarkersState } from './store/states/sedi-markers.state';
import { CentroMappaState } from './store/states/centro-mappa.state';
import { ChiamateMarkersState } from './store/states/chiamate-markers.state';
import { ComposizionePartenzaState } from '../home/store/states/composizione-partenza/composizione-partenza.state';
import { AreaMappaState } from './store/states/area-mappa.state';
import { AreaMappa } from './maps-model/area-mappa-model';
import { MapsDirectionState } from './store/states/maps-direction.state';
import { DirectionInterface } from './maps-interface/direction-interface';
import { FiltriRichiesteState } from '../home/store/states/filterbar/filtri-richieste.state';
import { VoceFiltro } from '../home/filterbar/filtri-richieste/voce-filtro.model';
import { ViewComponentState } from '../home/store/states/view/view.state';
import { SetMapLoaded } from '../../shared/store/actions/app/app.actions';
import { SetAreaMappa } from './store/actions/area-mappa.actions';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {

    @Input() viewStateMappa: ViewInterfaceMaps;
    @Input() boxAttivi: boolean;
    @Input() tastoChiamataMappaActive: boolean;

    @Select(CentroMappaState.centroMappa) centroMappa$: Observable<CentroMappa>;
    centroMappa: CentroMappa;
    @Select(ChiamateMarkersState.chiamateMarkers) chiamataMarkers$: Observable<ChiamataMarker[]>;
    @Select(ComposizionePartenzaState.richiestaComposizioneMarker) composizioneMarkers$: Observable<ComposizioneMarker[]>;
    @Select(SediMarkersState.sediMarkers) sediMarkers$: Observable<SedeMarker[]>;
    @Select(AreaMappaState.areaMappaLoading) areaMappaLoading$: Observable<boolean>;
    @Select(MapsDirectionState.direction) direction$: Observable<DirectionInterface>;

    // Filtri Richieste Selezionati
    @Select(FiltriRichiesteState.filtriRichiesteSelezionati) filtriRichiesteSelezionati$: Observable<VoceFiltro[]>;
    // Status "Schede Contatto"
    @Select(ViewComponentState.schedeContattoStatus) schedeContattoStatus$: Observable<boolean>;
    // Status "Composizione Partenza"
    @Select(ViewComponentState.composizioneStatus) composizioneStatus$: Observable<boolean>;
    // Status "Mezzi in Servizio"
    @Select(ViewComponentState.mezziInServizioStatus) mezziInServizioStatus$: Observable<boolean>;

    mapsFullyLoaded = false;

    private subscription: Subscription = new Subscription();

    constructor(private store: Store) {
        this.getCentroMappa();
    }

    ngOnInit(): void {
        console.log('Componente Maps creato');
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        console.log('Componente Maps distrutto');
    }

    getCentroMappa(): void {
        this.subscription.add(
            this.centroMappa$.subscribe((r: CentroMappa) => {
                this.centroMappa = r;
            })
        );
    }

    mapIsLoaded(areaMappa: AreaMappa, spatialReference?: SpatialReference): void {
        if (areaMappa) {
            this.mapsFullyLoaded = true;
            if (this.mapsFullyLoaded) {
                setTimeout(() => {
                    this.store.dispatch([
                        new SetMapLoaded(true, { spatialReference }),
                        new SetAreaMappa(areaMappa)
                    ]);
                }, 2000);
            }
        }
    }
}
