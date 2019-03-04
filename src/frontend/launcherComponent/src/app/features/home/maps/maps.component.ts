import { Component, Input, isDevMode, OnDestroy, OnInit } from '@angular/core';
import * as MapManager from '../../../core/manager/maps-manager';
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

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {

    centroMappa: CentroMappa;
    richiesteMarkers: RichiestaMarker[] = [];
    subscription = new Subscription();
    @Input() viewStateMappa: ViewInterfaceMaps;
    @Select(SchedaTelefonataState.chiamataMarker) chiamataMarkers$: Observable<ChiamataMarker[]>;
    @Select(RichiestaComposizioneState.richiestaComposizioneMarker) composizioneMarkers$: Observable<ComposizioneMarker[]>;
    @Select(MezziMarkersState.mezziMarkers) mezziMarkers$: Observable<MezzoMarker[]>;
    @Select(SediMarkersState.sediMarkers) sediMarkers$: Observable<SedeMarker[]>;
    mapsFullyLoaded = false;

    constructor(private richiesteManager: MapManager.RichiesteMarkerManagerService,
                private centroManager: MapManager.CentroMappaManagerService,
                private toastr: ToastrService) {
        this.timeoutAlert('showToastr');
        /**
         *  mi iscrivo al map manager che mi ritorna il centro della mappa
         */
        this.subscription.add(this.centroManager.getCentro().subscribe((r: CentroMappa) => {
            this.centroMappa = r;
        }));
        /**
         *  mi iscrivo al map manager che mi ritorna tutti i marker di tipo richiestaMarker
         */
        this.subscription.add(this.richiesteManager.getRichiesteMarker().subscribe((r: RichiestaMarker[]) => {
            this.richiesteMarkers = r;
            /**
             *  inizializzo un contatore nel servizio per tenere traccia del numero di richieste
             */
            if (this.richiesteManager.count > 0) {
                this.richiesteManager.count = this.richiesteMarkers.length;
            }
        }));
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
            if (this.richiesteMarkers.length > 0 && this.mapsFullyLoaded) {
                this.timeoutAlert('clearToastr');
            }
        }
    }

}
