import {Component, OnInit} from '@angular/core';
import {CentroMappa} from './maps-model/centro-mappa.model';
import {RichiestaMarker} from './maps-model/richiesta-marker.model';
import {MapsService} from './service/maps-service/maps-service.service';
import {Coordinate} from '../shared/model/coordinate.model';
import {MapManagerService} from './service/maps-manager/map-manager-service.service';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

    centroMappa: CentroMappa;
    richiesteMarkers: RichiestaMarker[];

    constructor(private mapsService: MapsService,
                private mapManager: MapManagerService /** servizio che innietta dati alla mappa **/) {
        /**
         *  creo un oggetto di tipo centroMappa per inizializzare la mappa
         */
        const initCentroMappa = new CentroMappa(new Coordinate(42.290251, 12.492373), 8);
        /* Roma */
        this.centroMappa = initCentroMappa;
    }

    ngOnInit() {
        /**
         *  mi iscrivo al map manager che mi ritorna tutti i marker di tipo richiestaMarker
         */
        this.mapManager.getRichiesteMarker().subscribe((r: RichiestaMarker[]) => {
            this.richiesteMarkers = r;
            /**
             *  inizializzo un contatore nel servizio per tenere traccia del numero di richieste
             */
            this.mapManager.count = this.richiesteMarkers.length;
        });
    }

}
