import { Component, OnInit } from '@angular/core';
import { CentroMappa } from './maps-model/centro-mappa.model';
import { RichiestaMarker } from './maps-model/richiesta-marker.model';
import { MapsService } from './service/maps-service/maps-service.service';
import { Coordinate } from '../shared/model/coordinate.model';
import { MapManagerService } from './service/maps-manager/map-manager-service.service';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

    centroMappa: CentroMappa;
    initCentroMappa: CentroMappa;
    newCentroMappa: CentroMappa;

    richiesteMarkers: RichiestaMarker[];

    constructor(private mapsService: MapsService,
        private mapManager: MapManagerService /** servizio che innietta dati alla mappa **/) {
        /**
         *  creo un oggetto di tipo centroMappa per inizializzare la mappa
         */
        this.centroMappa = new CentroMappa(new Coordinate(42.290251, 12.492373), 8);
        /* Roma */
        this.newCentroMappa = new CentroMappa(new Coordinate(45.283828, 9.105340), 8);
        /* Milano */
    }

    ngOnInit() {
        /**
         *  mi iscrivo al map manager che mi ritorna tutti i marker
         */
        this.mapManager.getData().subscribe((r: RichiestaMarker[]) => {
            this.richiesteMarkers = r;
        });
        // this.mapsService.getCentro().subscribe((r: CentroMappa) => {
        //     console.log('subscribe centro');
        //     this.centroMappa = r;
        // });
    }
}
