import { Component, OnDestroy, OnInit } from '@angular/core';
import * as MapManager from '../core/manager/maps-manager';
import { CentroMappa } from './maps-model/centro-mappa.model';
import { RichiestaMarker } from './maps-model/richiesta-marker.model';
import { SedeMarker } from './maps-model/sede-marker.model';
import { MezzoMarker } from './maps-model/mezzo-marker.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {

    centroMappa: CentroMappa;
    richiesteMarkers: RichiestaMarker[];
    sediMarkers: SedeMarker[];
    mezziMarkers: MezzoMarker[];
    chiamataMarker: any;
    subscription = new Subscription();

    constructor(private richiesteManager: MapManager.RichiesteMarkerManagerService,
                private sediManager: MapManager.SediMarkerManagerService,
                private mezziManager: MapManager.MezziMarkerManagerService,
                private centroManager: MapManager.CentroMappaManagerService) {
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
            this.richiesteManager.count = this.richiesteMarkers.length;
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
        this.chiamataMarker = null;
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
