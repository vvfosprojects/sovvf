import { Component, Input, isDevMode, OnDestroy, OnInit } from '@angular/core';
import * as MapManager from '../core/manager/maps-manager';
import { CentroMappa } from './maps-model/centro-mappa.model';
import { RichiestaMarker } from './maps-model/richiesta-marker.model';
import { SedeMarker } from './maps-model/sede-marker.model';
import { MezzoMarker } from './maps-model/mezzo-marker.model';
import { ChiamataMarker } from './maps-model/chiamata-marker.model';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ViewInterfaceMaps } from '../filterbar/view-mode/view.interface';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {

    centroMappa: CentroMappa;
    richiesteMarkers: RichiestaMarker[] = [];
    sediMarkers: SedeMarker[];
    mezziMarkers: MezzoMarker[];
    chiamataMarker: ChiamataMarker[];
    subscription = new Subscription();
    @Input() viewStateMappa: ViewInterfaceMaps;
    mapsFullyLoaded = false;

    constructor(private richiesteManager: MapManager.RichiesteMarkerManagerService,
                private sediManager: MapManager.SediMarkerManagerService,
                private mezziManager: MapManager.MezziMarkerManagerService,
                private centroManager: MapManager.CentroMappaManagerService,
                private chiamataManager: MapManager.ChiamataMarkerManagerService,
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

        /**
         *  mi iscrivo al map manager che mi ritorna tutti i marker di tipo mezzoMarker
         */
        this.subscription.add(this.mezziManager.getMezziMarker().subscribe((r: MezzoMarker[]) => {
            this.mezziMarkers = r;
        }));

        /**
         *  mi iscrivo al map manager che mi ritorna tutti i marker di tipo richiestaMarker
         */
        this.subscription.add(this.sediManager.getSediMarker().subscribe((r: SedeMarker[]) => {
            this.sediMarkers = r;
        }));

        /**
         * placeholder di una chiamata vuota
         */
        this.subscription.add(this.chiamataManager.getChiamataMarker().subscribe((r: ChiamataMarker[]) => {
            this.chiamataMarker = r;
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
