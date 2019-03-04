import { Component, Input, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { CentroMappa } from './maps-model/centro-mappa.model';
import { RichiestaMarker } from './maps-model/richiesta-marker.model';
import { MezzoMarker } from './maps-model/mezzo-marker.model';
import { SedeMarker } from './maps-model/sede-marker.model';
import { ChiamataMarker } from './maps-model/chiamata-marker.model';
import { ComposizioneMarker } from './maps-model/composizione-marker.model';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ViewInterfaceMaps } from '../../../shared/interface/view.interface';
import { Select } from '@ngxs/store';
import { SchedaTelefonataState } from '../store/states/chiamata/scheda-telefonata.state';
import { RichiestaComposizioneState } from '../store/states/composizione-partenza/richiesta-composizione.state';
import { MezziMarkersState } from '../store/states/maps/mezzi-markers.state';
import { SediMarkersState } from '../store/states/maps/sedi-markers.state';
import { RichiesteMarkersState } from '../store/states/maps/richieste-markers.state';
import { CentroMappaState } from '../store/states/maps/centro-mappa.state';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {

    centroMappa: CentroMappa;
    subscription = new Subscription();
    richiesteLenght: number;
    @Input() viewStateMappa: ViewInterfaceMaps;
    @Select(CentroMappaState.centroMappa) centroMappa$: Observable<CentroMappa>;
    @Select(SchedaTelefonataState.chiamataMarker) chiamataMarkers$: Observable<ChiamataMarker[]>;
    @Select(RichiestaComposizioneState.richiestaComposizioneMarker) composizioneMarkers$: Observable<ComposizioneMarker[]>;
    @Select(RichiesteMarkersState.richiesteMarkers) richiesteMarkers$: Observable<RichiestaMarker[]>;
    @Select(RichiesteMarkersState.richiesteLenghtMarkers) richiesteLenghtMarkers$: Observable<number>;
    @Select(MezziMarkersState.mezziMarkers) mezziMarkers$: Observable<MezzoMarker[]>;
    @Select(SediMarkersState.sediMarkers) sediMarkers$: Observable<SedeMarker[]>;
    mapsFullyLoaded = false;

    constructor(private toastr: ToastrService) {
        this.timeoutAlert('showToastr');
        this.subscription.add(this.centroMappa$.subscribe((r: CentroMappa) => {
            this.centroMappa = r;
        }));
        this.subscription.add(this.richiesteLenghtMarkers$.subscribe( (l: number) => this.richiesteLenght = l));
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Maps creato');
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Maps distrutto');
    }

    timeoutAlert(value: string) {
        setTimeout(() => this[value](), 0);
    }

    showToastr() {
        this.toastr.info('Caricamento in corso...', 'Attendere', {
            disableTimeOut: true
        });
    }

    clearToastr() {
        this.toastr.clear();
    }

    mapIsLoaded(event) {
        if (event) {
            this.mapsFullyLoaded = true;
            if (this.richiesteLenght > 0 && this.mapsFullyLoaded) {
                this.timeoutAlert('clearToastr');
            }
        }
    }

}
