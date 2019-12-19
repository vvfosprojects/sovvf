import { Component, EventEmitter, Input, isDevMode, OnDestroy, OnInit, Output } from '@angular/core';
import { CentroMappa } from './maps-model/centro-mappa.model';
import { RichiestaMarker } from './maps-model/richiesta-marker.model';
import { MezzoMarker } from './maps-model/mezzo-marker.model';
import { SedeMarker } from './maps-model/sede-marker.model';
import { ChiamataMarker } from './maps-model/chiamata-marker.model';
import { ComposizioneMarker } from './maps-model/composizione-marker.model';
import { Observable, Subscription } from 'rxjs';
import { ViewInterfaceMaps } from '../../../shared/interface/view.interface';
import { Select } from '@ngxs/store';
import { MezziMarkersState } from '../store/states/maps/mezzi-markers.state';
import { SediMarkersState } from '../store/states/maps/sedi-markers.state';
import { RichiesteMarkersState } from '../store/states/maps/richieste-markers.state';
import { CentroMappaState } from '../store/states/maps/centro-mappa.state';
import { MapService } from './service/map-service/map-service.service';
import { MarkerService } from './service/marker-service/marker-service.service';
import { ChiamateMarkersState } from '../store/states/maps/chiamate-markers.state';
import { ComposizionePartenzaState } from '../store/states/composizione-partenza/composizione-partenza.state';
import { SchedeContattoMarkers } from '../store/states/maps/schede-contatto-markers.state';
import { SchedaContattoMarker } from './maps-model/scheda-contatto.model';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css'],
    providers: [MapService, MarkerService]
})
export class MapsComponent implements OnInit, OnDestroy {

    centroMappa: CentroMappa;
    subscription = new Subscription();
    @Input() viewStateMappa: ViewInterfaceMaps;
    @Select(CentroMappaState.centroMappa) centroMappa$: Observable<CentroMappa>;
    @Select(ChiamateMarkersState.chiamateMarkers) chiamataMarkers$: Observable<ChiamataMarker[]>;
    @Select(ComposizionePartenzaState.richiestaComposizioneMarker) composizioneMarkers$: Observable<ComposizioneMarker[]>;
    @Select(RichiesteMarkersState.richiesteMarkers) richiesteMarkers$: Observable<RichiestaMarker[]>;
    @Select(MezziMarkersState.mezziMarkers) mezziMarkers$: Observable<MezzoMarker[]>;
    @Select(SediMarkersState.sediMarkers) sediMarkers$: Observable<SedeMarker[]>;
    @Select(SchedeContattoMarkers.schedeContattoMarkers) schedeContattoMarkers$: Observable<SchedaContattoMarker[]>;

    mapsFullyLoaded = false;
    @Output() mapFullLoaded = new EventEmitter<boolean>();

    constructor() {
        this.subscription.add(this.centroMappa$.subscribe((r: CentroMappa) => {
            this.centroMappa = r;
        }));
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Maps creato');
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Maps distrutto');
    }

    mapIsLoaded(event) {
        if (event) {
            this.mapsFullyLoaded = true;
            if (this.mapsFullyLoaded) {
                setTimeout(() => {
                    this.mapFullLoaded.emit(this.mapsFullyLoaded);
                }, 2000);
            }
        }
    }

}
