import {Component, OnChanges, OnInit} from '@angular/core';
import {CentroMappa} from './maps-db-interventi/maps-model/centro-mappa.model';
import {RichiestaMarker} from './maps-db-interventi/maps-model/richiesta-marker.model';
import {MapsService} from './maps-db-interventi/maps-service/maps-service.service';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

    centroMappa: CentroMappa;
    richiesteMarkers: RichiestaMarker[];

    constructor(private mapsService: MapsService /** servizio che innietta dati alla mappa **/ ) {
    }

    ngOnInit() {
        /**
         *  creo una proprietà per testare la ricezione di dati per il db-interventi di mappa
         */
        this.centroMappa = {lat: 42.290251, lng: 12.492373, zoom: 8};
        /**
         *  mi iscrivo all'api che mi invia le richieste
         */
        this.mapsService.getData().subscribe((r: RichiestaMarker[]) => {
            this.richiesteMarkers = r;
            /**
             *  inizializzo un contatore nel servizio per tenere traccia del numero di richieste
             */
            this.mapsService.count = this.richiesteMarkers.length;
        });
    }

    setCentroMappa() {
        this.centroMappa = {lat: 52.290251, lng: 22.492373, zoom: 7};
    }
}
